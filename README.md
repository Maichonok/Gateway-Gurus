# Fraud Detection Support Frontend

This project is a frontend application built with React and Vite.
It provides a user interface for submitting support requests and interacting with a backend service
that assesses potential fraud risk associated with the request.

## Features

* Input form to collect User ID (email) and the support request text.
* Sends the collected data to a backend API endpoint (`/support-check`).
* Displays the conversation history between the user and the support system.
* Shows the fraud risk score and reasons provided by the backend for each support interaction.
* Includes demo email buttons for easy testing.

## Technology Stack

* **Framework:** React 19
* **Build Tool:** Vite
* **HTTP Client:** Axios
* **State Management:** React Hooks (React-Redux and Redux are installed but might not be fully integrated yet).
* **Routing:** (React Router DOM is installed but might not be fully integrated yet).
* **Linting:** ESLint

## Prerequisites

* Node.js and npm (or yarn) installed.
* A running instance of the corresponding backend service accessible at `http://localhost:8000`.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd fraud-detection-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

* `npm run dev`: Runs the app in development mode with hot reloading.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run lint`: Lints the project files using ESLint.
* `npm run preview`: Serves the production build locally for preview.