import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import authRoutes from './routes/authRoutes.js';
import { authenticateWithSession } from './middlewares/authMiddleware.js';
import apiRoutes from './routes/index.js';
import connectDB from './config/database.js';
import storyRoutes from './routes/storyRoutes.js'; // Added import for storyRoutes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Set up Express app
const app = express();

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

console.log('Session secret:', process.env.SESSION_SECRET);
console.log('Database URL:', process.env.DATABASE_URL);

app.use(
  session({
    name: 'express.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL, ttl: 90 * 24 * 60 * 60 }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000
    }
  }),
);
console.log('Session middleware configured');

// Use the new middleware
app.use(authenticateWithSession);
app.use(authRoutes);

app.use(apiRoutes);
app.use('/api', storyRoutes); // Added storyRoutes to the middleware chain

app.use(express.static(path.join(__dirname, "..", "dist")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve static files from the uploads directory

// Assume all other routes are frontend
app.get(/.*/, async (req, res) => {
    // Try to serve pre-built frontend from ../dist/ folder
    const clientBundlePath = path.join(__dirname, "..", "dist", "index.html");

    if (!existsSync(clientBundlePath)) {
        if (process.env.NODE_ENV === "development") {
            // In development, we just want to redirect to the Vite dev server
            return res.redirect("http://localhost:5173");
        } else {
            // Looks like "npm run build:ui" wasn't run and the UI isn't built, show a nice error message instead
            return res.status(404).send("Front-end not available.");
        }
    }
    res.sendFile(path.join(import.meta.dirname, "..", "dist", "index.html"));
});

export default app;