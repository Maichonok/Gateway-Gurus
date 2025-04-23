from opperai import AsyncOpper
from models import FraudDetection
from config import FRAUD_PROMPT, PRIMARY_MODEL, FALLBACK_MODELS

# Initialize AsyncOpper - could potentially be enhanced for singleton pattern if needed
opper = AsyncOpper()

async def detect_fraudulent_email(customer_email: str, latitude: float, longitude: float) -> FraudDetection:
    """
    Analyzes a customer email using OpperAI to detect potential fraud.

    Args:
        customer_email: The text content of the customer's email.

    Returns:
        A FraudDetection object containing the analysis result.
    """
    full_input = f"""
        Email: \"{customer_email.strip()}\"
        Latitude: {latitude}
        Longitude: {longitude}
        """
    result, _ = await opper.call(
        name="FraudDetection", # A descriptive name for the Opper call
        instructions=FRAUD_PROMPT,
        input=full_input,
        output_type=FraudDetection,
        model=PRIMARY_MODEL,
        fallback_models=FALLBACK_MODELS
    )
    return result
