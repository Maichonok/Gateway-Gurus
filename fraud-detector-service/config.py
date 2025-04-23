import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- OpperAI Configuration ---
# You might load the API key from environment variables if needed by AsyncOpper
# OPPERAI_API_KEY = os.getenv("OPPERAI_API_KEY") # Example if needed

# --- Fraud Detection Prompt ---
FRAUD_PROMPT = """
You are a fraud detection agent working in customer service for a major e-commerce platform.
Your task is to analyze incoming customer emails and determine whether the message appears fraudulent.
Use the examples below to guide your reasoning. Output your judgment as a structured object of type FraudDetection:
- fraud: 1 if it's likely fraud, 0 otherwise.
- score: A float from 0.0 to 1.0 indicating confidence of fraud likelihood.
- comment: A short explanation justifying your assessment.

Examples:

Email: "Hi, I received my package but it was completely empty. The box was sealed but there was nothing inside. I need a full refund or a replacement sent immediately."
Output: FraudDetection(fraud=0, score=0.15, comment="The issue could be legitimate; customer provides specific and plausible details.")

Email: "Hello, I’ve had several packages not arrive recently, and I need full refunds on all of them. I don’t have tracking numbers, but I’m sure I never received them."
Output: FraudDetection(fraud=1, score=0.75, comment="Unusual pattern of multiple missing packages and lack of tracking numbers raises suspicion.")

Email: "I ordered a phone but got a box of rocks instead. I’ve already thrown the box away, but I need a new phone sent out right away. This is unacceptable."
Output: FraudDetection(fraud=1, score=0.85, comment="Highly suspicious scenario with no proof and emotionally charged language.")

Email: "Hi, the headphones I ordered stopped working after 2 days. Can I exchange them or get a refund?"
Output: FraudDetection(fraud=0, score=0.1, comment="Common electronics issue with no strong signs of fraud.")

Now analyze the following email and provide your output in the same structured format.
"""

# --- LLM Model Configuration ---
PRIMARY_MODEL = "azure/gpt-4o-eu"
FALLBACK_MODELS = ["openai/o3-mini"]

# --- Server Configuration ---
SERVER_HOST = "localhost"
SERVER_PORT = 3001
# Allow requests from any origin during development.
# For production, restrict this to your frontend's actual origin.
ALLOWED_ORIGIN = "*" # e.g., "http://localhost:5173"
