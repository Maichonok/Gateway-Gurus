# Gateway Gurus - Fraud Detection System

This repository contains the complete system for the Gateway Gurus Fraud Detection feature, composed of a user-facing frontend and an analytical backend service.

## Overview

The system consists of two main components:

1.  **Frontend (`fraud-detection-frontend/`)**: A React application (built with Vite) providing the user interface for submitting support requests. Users input their details and the request text, which is then sent to the backend for analysis. Change the file name from `customer-frontend` to `fraud-detection-frontend/`.
2.  **Backend (`fraud-detector-service/`)**: A Python API service (built with `aiohttp`) that receives requests from the frontend, uses an external AI service (OpperAI) to analyze the text for potential fraud indicators, and returns an assessment score and commentary.

## Directory Structure

```
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
```

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
    ```bash![Flowchart](https://github.com/user-attachments/assets/53e92430-9c03-4491-a6d5-6a0e41e61ed8)

    # Ensure you are in the monorepo root directory
    npm install --save-dev concurrently
    ```
    *(This will also create a `package-lock.json` and a `node_modules` folder in the root, which is expected).*

4.  Create a Docker container with this command:

```
docker run -d \
-e "KONG_ROLE=data_plane" \
-e "KONG_DATABASE=off" \
-e "KONG_VITALS=off" \
-e "KONG_CLUSTER_MTLS=pki" \
-e "KONG_CLUSTER_CONTROL_PLANE=acf7a2b388.eu.cp0.konghq.com:443" \
-e "KONG_CLUSTER_SERVER_NAME=acf7a2b388.eu.cp0.konghq.com" \
-e "KONG_CLUSTER_TELEMETRY_ENDPOINT=acf7a2b388.eu.tp0.konghq.com:443" \
-e "KONG_CLUSTER_TELEMETRY_SERVER_NAME=acf7a2b388.eu.tp0.konghq.com" \
-e "KONG_CLUSTER_CERT=-----BEGIN CERTIFICATE-----
MIICjTCCAjSgAwIBAgIBATAKBggqhkjOPQQDBDB4MXYwCQYDVQQGEwJFVTBpBgNV
BAMeYgBrAG8AbgBuAGUAYwB0AC0ARwBhAHQAZQB3AGEAeQAgAEcAdQByAHUAcwAg
AGYAcgBhAHUAZAAgAGQAZQB0AGUAYwB0AGkAbwBuACAAQQBQAEkAIABnAGEAdABl
AHcAYQB5MB4XDTI1MDQyMzA4NDI0NloXDTM1MDQyMzA4NDI0NloweDF2MAkGA1UE
BhMCRVUwaQYDVQQDHmIAawBvAG4AbgBlAGMAdAAtAEcAYQB0AGUAdwBhAHkAIABH
AHUAcgB1AHMAIABmAHIAYQB1AGQAIABkAGUAdABlAGMAdABpAG8AbgAgAEEAUABJ
ACAAZwBhAHQAZQB3AGEAeTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABLeqLykU
2zMTbQuweWExwLf/UZ9GZ6DwgEkfaK43ISn2CEDQEptPYkGRsaMHyXJrtevRtsvp
1LOblhA5eC1Av8Kjga4wgaswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCAAYwHQYD
VR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBcGCSsGAQQBgjcUAgQKDAhjZXJ0
VHlwZTAjBgkrBgEEAYI3FQIEFgQUAQEBAQEBAQEBAQEBAQEBAQEBAQEwHAYJKwYB
BAGCNxUHBA8wDQYFKQEBAQECAQoCARQwEwYJKwYBBAGCNxUBBAYCBAAUAAowCgYI
KoZIzj0EAwQDRwAwRAIga8kXWouatXR8u5QGXpsofPHoSw5mElY2ZKjvCSqUlrYC
ICWfaQS1LazXpPy2/SnCC0Aa+JWRFJGwryyvHbtJWTc+
-----END CERTIFICATE-----" \
-e "KONG_CLUSTER_CERT_KEY=-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgfG2KBAZ23jvRmfuh
SHSqo5aO6s99p4pGpejCI8Gr3kigCgYIKoZIzj0DAQehRANCAAS3qi8pFNszE20L
sHlhMcC3/1GfRmeg8IBJH2iuNyEp9ghA0BKbT2JBkbGjB8lya7Xr0bbL6dSzm5YQ
OXgtQL/C
-----END PRIVATE KEY-----" \
-e "KONG_LUA_SSL_TRUSTED_CERTIFICATE=system" \
-e "KONG_KONNECT_MODE=on" \
-e "KONG_CLUSTER_DP_LABELS=created-by:quickstart,type:docker-macOsArmOS" \
-e "KONG_ROUTER_FLAVOR=expressions" \
-p 8000:8000 \
-p 8443:8443 \
kong/kong-gateway:3.10
```

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
![Flowchart](https://github.com/user-attachments/assets/db020a47-d827-4796-8744-3dd41c3f9836)
