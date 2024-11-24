import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './api/app.js';
import logger from './api/utils/log.js';
import connectDB from './api/config/database.js';

const log = logger('server');
const server = http.createServer(app);

process.on('uncaughtException', (err) => {
  log.fatal({ err }, `Unhandled error ${err}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  server.close(() => {
    process.exit(1);
  });
});

// Main entry point to the application
const main = async () => {
  console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
  console.log('Database URL:', process.env.DATABASE_URL);
  try {
    await connectDB();
    const port = parseInt(process.env.PORT) || 3000;
    server.listen(port, () => {
      log.info(`Listening on http://localhost:${port}/`);
    });
  } catch (error) {
    log.error('Failed to start the server:', error);
    process.exit(1);
  }
};

main();