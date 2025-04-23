import json
from aiohttp import web
from pydantic import ValidationError

from models import FraudRequest, FraudDetection
from fraud_detector import detect_fraudulent_email
from config import ALLOWED_ORIGIN

# Define common CORS headers
cors_headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

async def handle_fraud_detection(request: web.Request) -> web.Response:
    """Handles POST requests to the fraud detection endpoint."""
    if request.method != 'POST':
        return web.Response(status=405, text="Method Not Allowed", headers=cors_headers)

    try:
        # Read and validate request body using Pydantic model
        raw_data = await request.json()
        try:
            request_data = FraudRequest(**raw_data)
        except ValidationError as e:
             # Provide more specific error for invalid input structure
            error_details = e.errors()
            return web.json_response({'error': 'Invalid request body', 'details': error_details}, status=400, headers=cors_headers)


        # Call the fraud detection service
        fraud_result: FraudDetection = await detect_fraudulent_email(request_data.email)

        # Prepare and return the successful response
        response_data = fraud_result.model_dump()
        return web.json_response(response_data, headers=cors_headers)

    except json.JSONDecodeError:
        return web.json_response({'error': 'Invalid JSON format'}, status=400, headers=cors_headers)
    except Exception as e:
        # Log the error for debugging (replace print with proper logging in production)
        print(f"An unexpected error occurred: {e}")
        # Return a generic internal server error
        return web.json_response({'error': 'Internal server error'}, status=500, headers=cors_headers)


async def handle_options(request: web.Request) -> web.Response:
    """Handles CORS preflight OPTIONS requests."""
    # Simply return 200 OK with the CORS headers
    return web.Response(status=200, headers=cors_headers)
