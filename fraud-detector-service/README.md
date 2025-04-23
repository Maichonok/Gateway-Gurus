# Fraud Detection Service

This project provides a backend service built with Python and `aiohttp` that analyzes customer email text to assess potential fraud risk using the OpperAI platform. It's designed to be called by a frontend application.

## Features

*   Receives customer email text via a REST API endpoint.
*   Uses `opperai` library to interact with an LLM for fraud analysis based on a predefined prompt.
*   Structures input and output using Pydantic models.
*   Returns a fraud assessment including a binary flag, a confidence score, and a comment.
*   Asynchronous handling of requests using `aiohttp`.
*   Modular codebase for better maintainability.

## Technology Stack

*   **Language:** Python 3
*   **Web Framework:** `aiohttp`
*   **Data Validation:** `Pydantic`
*   **AI Interaction:** `opperai` library
*   **Configuration:** `python-dotenv` (optional, for environment variables)

## Prerequisites

*   Python 3 (Check with `python3 --version`)
*   `pip` (usually comes with Python 3, often as `pip3`)
*   Access to the OpperAI platform or compatible API endpoint configured within `opperai`.
*   **(Recommended)** Familiarity with Python virtual environments.

## Getting Started

1.  **Clone the repository (if applicable):**
    If this service is part of a larger repository, navigate to this specific service's directory.
    ```bash
    # Example if it's a sub-directory
    cd path/to/your/project/fraud-detector-service
    ```

2.  **Create and Activate a Virtual Environment:**
    It's highly recommended to use a virtual environment to manage dependencies.
    ```bash
    # Create the virtual environment (e.g., named .venv)
    python3 -m venv .venv

    # Activate it (macOS/Linux)
    source .venv/bin/activate
    # On Windows Git Bash/WSL, use the same command.
    # On Windows Command Prompt: .venv\Scripts\activate
    # On Windows PowerShell: .venv\Scripts\Activate.ps1
    ```
    You should see `(.venv)` at the start of your terminal prompt.

3.  **Install Dependencies:**
    Install the required Python packages.
    ```bash
    pip install -r requirements.txt
    # OR, if you don't have a requirements.txt yet:
    # pip install aiohttp pydantic python-dotenv opperai
    ```
    *(Optional: Create a `requirements.txt` file for easier dependency management: `pip freeze > requirements.txt`)*

4.  **Configuration (Optional):**
    *   Review `config.py` for settings like the fraud detection prompt, LLM model names, and server host/port.
    *   If you need to use environment variables (e.g., for API keys needed by `opperai`), create a `.env` file in the project root and add them there (e.g., `OPPERAI_API_KEY=your_key`). The `python-dotenv` library will load these.

5.  **Run the Server:**
    ```bash
    python server.py
    ```
    The server will start, typically listening on `http://localhost:3001` (or the host/port specified in `config.py`).

## API Endpoint

### `/`

*   **Method:** `POST`
*   **Description:** Analyzes the provided email text for fraud risk.
*   **Request Body (JSON):**
    ```json
    {
      "email": "Text content of the customer's email..."
    }
    ```
*   **Success Response (200 OK - JSON):**
    ```json
    {
      "fraud": 0,       // 1 for likely fraud, 0 otherwise
      "score": 0.15,    // Confidence score (0.0 to 1.0)
      "comment": "Explanation from the fraud detection agent..."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid JSON or request body structure.
    *   `405 Method Not Allowed`: If a method other than POST (or OPTIONS for CORS) is used.
    *   `500 Internal Server Error`: If an unexpected error occurs during processing.

## Example Request (`curl`)

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"email": "Hi, my package arrived empty. Please refund."}' \
     http://localhost:3001/
```
