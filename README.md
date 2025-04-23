# Gateway Gurus - Fraud Detection System

This repository contains the complete system for the Gateway Gurus Fraud Detection feature, composed of a user-facing frontend and an analytical backend service.

## Overview

The system consists of two main components:

1.  **Frontend (`fraud-detection-frontend/`)**: A React application (built with Vite) providing the user interface for submitting support requests. Users input their details and the request text, which is then sent to the backend for analysis.
2.  **Backend (`fraud-detector-service/`)**: A Python API service (built with `aiohttp`) that receives requests from the frontend, uses an external AI service (OpperAI) to analyze the text for potential fraud indicators, and returns an assessment score and commentary.

## Directory Structure

/
├── fraud-detection-frontend/  # React Frontend UI
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md              # Frontend specific details
├── fraud-detector-service/    # Python Backend API
│   ├── config.py
│   ├── models.py
│   ├── server.py
│   ├── requirements.txt
│   └── README.md              # Backend specific details
├── package.json               # Root package.json for concurrent execution
└── README.md                  # This file (Monorepo Overview)

## Prerequisites

To run the entire system, you will need:

*   **Node.js and npm:** Required for the frontend application and for running both services concurrently.
*   **Python 3 and pip:** Required for the backend service. Using a Python **virtual environment** for the backend is strongly recommended (see backend README).

## Running Both Projects Concurrently

To simplify development and testing, you can run both the frontend and backend servers simultaneously with a single command from the **root directory** of this monorepo.

**First-Time Setup:**

1.  **Install Frontend Dependencies:**
    ```bash
    cd fraud-detection-frontend
    npm install
    cd ..
    ```
2.  **Setup Backend & Install Dependencies:**
    Follow the steps in `fraud-detector-service/README.md` to create and activate a virtual environment and install its Python dependencies (`pip install -r requirements.txt`). **Ensure the virtual environment is activated** in your terminal before proceeding to the next step.
    ```bash
    # Example (after creating .venv inside fraud-detector-service):
    source fraud-detector-service/.venv/bin/activate
    # Make sure you are back in the root directory after activating
    # cd .. (if you were inside fraud-detector-service)
    ```
3.  **Install Root Concurrent Runner:**
    From the **root directory**, install the tool to run commands concurrently.
    ```bash
    # Ensure you are in the monorepo root directory
    npm install --save-dev concurrently
    ```
    *(This will also create a `package-lock.json` and a `node_modules` folder in the root, which is expected).*

4.  **Add Run Script to Root `package.json`:**
    Create or edit the `package.json` file in the **root directory** and add the following script to the `"scripts"` section:
    ```json
    {
      "name": "fraud-detection-monorepo",
      "version": "1.0.0",
      "private": true,
      "scripts": {
        "start:all": "concurrently \"npm --prefix fraud-detection-frontend run dev\" \"python fraud-detector-service/server.py\""
      },
      "devDependencies": {
        "concurrently": "^8.2.2" // Or the version you installed
      }
    }
    ```
    *Note: This assumes the Python virtual environment for the backend is already activated in the terminal where you run `npm run start:all`.*

**Running the System:**

Once the first-time setup is complete and **after activating the backend's Python virtual environment** in your terminal:

1.  Navigate to the **root directory** of the monorepo.
2.  Run the combined start script:
    ```bash
    npm run start:all
    ```

This command will:
*   Start the React frontend development server (usually on port 5173).
*   Start the Python backend server (usually on port 3001).

You should see output from both processes in your terminal.

## Individual Project Details

For more detailed information on each specific project, including configuration, specific dependencies, testing, and individual running instructions, please refer to their respective README files:

*   [Frontend README](./fraud-detection-frontend/README.md)
*   [Backend README](./fraud-detector-service/README.md)
