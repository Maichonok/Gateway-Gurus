import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- OpperAI Configuration ---
# You might load the API key from environment variables if needed by AsyncOpper
# OPPERAI_API_KEY = os.getenv("OPPERAI_API_KEY") # Example if needed

# --- Fraud Detection Prompt ---
# FRAUD_PROMPT = """
# You are a fraud detection agent working in customer service for a major e-commerce platform.
# Your task is to analyze incoming customer emails and determine whether the message appears fraudulent.
# Use the examples below to guide your reasoning. Output your judgment as a structured object of type FraudDetection:
# - fraud: 1 if it's likely fraud, 0 otherwise.
# - score: A float from 0.0 to 1.0 indicating confidence of fraud likelihood.
# - comment: A short explanation justifying your assessment.

# Examples:

# Email: "Hi, I received my package but it was completely empty. The box was sealed but there was nothing inside. I need a full refund or a replacement sent immediately."
# Output: FraudDetection(fraud=0, score=0.15, comment="The issue could be legitimate; customer provides specific and plausible details.")

# Email: "Hello, I’ve had several packages not arrive recently, and I need full refunds on all of them. I don’t have tracking numbers, but I’m sure I never received them."
# Output: FraudDetection(fraud=1, score=0.75, comment="Unusual pattern of multiple missing packages and lack of tracking numbers raises suspicion.")

# Email: "I ordered a phone but got a box of rocks instead. I’ve already thrown the box away, but I need a new phone sent out right away. This is unacceptable."
# Output: FraudDetection(fraud=1, score=0.85, comment="Highly suspicious scenario with no proof and emotionally charged language.")

# Email: "Hi, the headphones I ordered stopped working after 2 days. Can I exchange them or get a refund?"
# Output: FraudDetection(fraud=0, score=0.1, comment="Common electronics issue with no strong signs of fraud.")

# Now analyze the following email and provide your output in the same structured format.
# """

FRAUD_PROMPT = """
You are a fraud detection and customer resolution specialist for a leading **home security company**.

Your task is to evaluate incoming customer service messages and determine whether the request appears fraudulent. These messages may involve equipment issues, security alerts, billing complaints, or service cancellations.

You must output your judgment using the structured format FraudDetection:
- fraud: 1 for likely fraud, 0 otherwise.
- score: A float from 0.0 to 1.0 indicating confidence.
- comment: A brief explanation based on reasoning.

When making your assessment, consider:
1. Specificity and plausibility of the complaint. **Vague or generic messages should raise suspicion**, even if the location is valid.
2. Consistency with typical customer behavior (e.g., prior complaint frequency, account status).
3. Tone and language: emotional pressure, aggression, or urgency (e.g., “cancel immediately,” “I demand…”).
4. Presence or absence of supporting details or evidence (e.g., photo of the device, error logs, dates).
5. Unusual behavior patterns (e.g., repeated refund requests, inconsistent billing history).
6. Geolocation data (latitude, longitude):  
   - If the message is sent from **outside Sweden** and the home address is inside Sweden, **flag it as likely fraud**.  
   - Sweden’s typical location range:
     - Latitude: 55.0 to 69.0  
     - Longitude: 11.0 to 24.0

### Examples:

Email: "Hi, my motion sensor keeps triggering false alarms at night. I’ve tried resetting it but the issue continues. Can I get a technician to check it?"
Latitude: 59.3  
Longitude: 17.9  
Output: FraudDetection(fraud=0, score=0.1, comment="Detailed and specific complaint from valid location.")

Email: "I want a refund. It’s not working."
Latitude: 60.1  
Longitude: 18.2  
Output: FraudDetection(fraud=1, score=0.85, comment="Location is within Sweden, but message is vague and lacks any technical or situational detail.")

Email: "I was charged twice for the same month. Please fix this billing issue."
Latitude: 48.85  
Longitude: 2.35  
Output: FraudDetection(fraud=1, score=0.9, comment="Message is from outside Sweden and lacks any customer-specific detail.")

Now analyze the following email and location data. Provide your output in the same structured format.
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
