# Your Life Story

Your Life Story is an innovative application that allows users to create captivating narratives based on uploaded images. Using the DALL-E and OpenAI APIs, the app analyzes images to generate detailed summaries, which are then used to craft engaging stories. Users can also listen to these stories narrated in a lifelike AI voice.

## Overview

The project is built using a modern tech stack with a React frontend and a Node/Express backend. It leverages MongoDB for data storage and integrates various APIs for image analysis and story generation. The frontend uses Vite for development and Tailwind CSS for styling, while the backend employs Mongoose for MongoDB interactions and Multer for file uploads.

### Technologies Used

- **Frontend:**
  - React
  - Vite
  - Tailwind CSS
  - animate.css
  - bootstrap
  - ejs
  - react-router-dom

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Multer
  - OpenAI API client library
  - body-parser
  - cors

### Project Structure

- **Frontend:**
  - `ui/`: Contains the React frontend code.
    - `ui/pages/`: Page components.
    - `ui/components/`: Reusable UI components.
    - `ui/styles/`: Styling files.
    - `ui/lib/`: Utility functions.
    - `ui/main.jsx`: Main entry point for the frontend.

- **Backend:**
  - `api/`: Contains the Express backend code.
    - `api/routes/`: API route handlers.
    - `api/controllers/`: Controllers for handling business logic.
    - `api/services/`: Service layer for interacting with external APIs and database.
    - `api/models/`: Mongoose models.
    - `api/middlewares/`: Middleware functions.
    - `api/utils/`: Utility functions.
    - `api/app.js`: Main Express app configuration.
    - `server.js`: Entry point for the backend server.

## Features

- **Image Upload and Analysis:**
  - Users can upload images within a story.
  - Images are analyzed using the DALL-E API to generate detailed summaries.

- **Story Generation:**
  - Summaries of the last 10 posts are used to generate compelling stories using the OpenAI API.
  - Users can provide instructions to improve the generated story.

- **Narration:**
  - Stories can be narrated in a lifelike AI voice with emotions and tone using the OpenAI text-to-voice API.

- **User Management:**
  - Users can store and verify their DALL-E API key through the profile page.
  - Token-based authentication for secure user management.

- **Story Management:**
  - Users can create and delete multiple stories.
  - No edit functionality is provided in the MVP.

- **Modern UI/UX:**
  - Subtle animations and transitions using animate.css.
  - Responsive and mobile-first design with Tailwind CSS and bootstrap.

## Getting Started

### Requirements

- Node.js
- MongoDB (local installation or MongoDB Atlas)
- npm (Node package manager)

### Quickstart

1. **Clone the Repository:**
   ```sh
   git clone <repository-url>
   cd your-life-story
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   cd ui
   npm install
   cd ..
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the project root and add the following environment variables:
     ```env
     NODE_ENV=development
     LOG_LEVEL=debug
     PORT=3000
     DATABASE_URL=<your-mongodb-url>
     SESSION_SECRET=<your-session-secret>
     ```

4. **Run the Development Server:**
   ```sh
   npm run dev
   ```

   This command will start both the frontend and backend servers concurrently.

5. **Access the Application:**
   - Open your browser and navigate to `http://localhost:3000`.

### License

The project is open source, licensed under the MIT License. See the [LICENSE](LICENSE).

Copyright © 2024 Pythagora-io.