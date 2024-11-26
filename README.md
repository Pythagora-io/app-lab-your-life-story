```markdown
# Your Life Story

Your Life Story is an innovative application that allows users to create detailed, compelling stories based on images they upload. By leveraging the power of the DALL-E and OpenAI APIs, the app analyzes the images to generate detailed summaries, which are then used to create engaging narratives. Users can also store their DALL-E API keys, verify them, and generate or improve stories with ease. The app features a modern, flashy UI/UX with subtle animations and transitions, providing an out-of-the-world experience.

## Overview

Your Life Story is built using a modern tech stack to ensure a seamless and responsive user experience. The project is structured into a frontend and backend, with the following key technologies:

- **Frontend**: ReactJS, Vite, Tailwind CSS, shadcn-ui, animate.css, Bootstrap, EJS
- **Backend**: Node.js, Express, MongoDB, Mongoose, Multer, OpenAI API, CORS, Body-parser
- **Authentication**: Token-based authentication using opaque bearer tokens
- **Deployment**: Vite devserver for frontend, Nodemon for backend, Concurrently to run both servers

### Project Structure

- `api/`: Contains the Express-based backend code
- `ui/`: Contains the ReactJS-based frontend code
- `public/`: Static assets
- `dist/`: Build output for the frontend
- Configuration files: `.babelrc`, `.env`, `.eslintrc.json`, `.gitignore`, `package.json`, `postcss.config.js`, `tailwind.config.js`, `vite.config.js`

## Features

- **Image Upload**: Users can upload images within a story.
- **Image Analysis**: The app uses the DALL-E API to analyze images and generate detailed summaries.
- **Story Generation**: Based on the image summaries, the app generates engaging stories using the OpenAI API.
- **Story Management**: Users can create and delete multiple stories.
- **API Key Management**: Users can store and verify their DALL-E API keys via the profile page.
- **Story Improvement**: Users can provide instructions to improve the generated stories.
- **Text-to-Voice**: The app provides a play button to narrate the stories using OpenAI's text-to-voice API.
- **Modern UI/UX**: The app features a modern, flashy design with subtle animations using animate.css and Bootstrap.

## Getting Started

### Requirements

To run the project, you will need the following technologies installed on your computer:

- Node.js (v14 or later)
- MongoDB (local installation or cloud service like MongoDB Atlas)

### Quickstart

1. **Clone the repository**:
    ```sh
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the project root and add the required environment variables:
    ```sh
    NODE_ENV=development
    LOG_LEVEL=debug
    PORT=3000
    DATABASE_URL=<your_mongodb_connection_string>
    SESSION_SECRET=<your_session_secret>
    ```

4. **Start the development servers**:
    ```sh
    npm run dev
    ```

5. **Access the application**:
    Open your browser and navigate to `http://localhost:5173`.

### License

The project is proprietary (not open source). All rights reserved. Copyright (c) 2024.
```