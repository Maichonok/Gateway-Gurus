from opperai import AsyncOpper
from models import FraudDetection
from config import FRAUD_PROMPT, PRIMARY_MODEL, FALLBACK_MODELS
from typing import Optional

# Initialize AsyncOpper - could potentially be enhanced for singleton pattern if needed
opper = AsyncOpper()

async def detect_fraudulent_email(customer_email: str, latitude: Optional[float] = None, longitude: Optional[float] = None) -> FraudDetection:
    """
    Analyzes a customer email using OpperAI to detect potential fraud.

    Args:
        customer_email: The text content of the customer's email.
        latitude: Optional latitude of the user's location.
        longitude: Optional longitude of the user's location.

    Returns:
        A FraudDetection object containing the analysis result.
    """
    geo_part = f"\nLatitude: {latitude}\nLongitude: {longitude}" if latitude is not None and longitude is not None else ""

    full_input = f"""
Email: \"{customer_email.strip()}\"{geo_part}
    """

    result, _ = await opper.call(
        name="FraudDetection",  # A descriptive name for the Opper call
        instructions=FRAUD_PROMPT,
        input=full_input,
        output_type=FraudDetection,
        model=PRIMARY_MODEL,
        fallback_models=FALLBACK_MODELS
    )

    return result
