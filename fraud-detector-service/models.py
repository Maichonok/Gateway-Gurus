from pydantic import BaseModel

# Define the output structure for fraud detection
class FraudDetection(BaseModel):
    fraud: int # 1 if it's likely fraud, 0 otherwise.
    score: float # A float from 0.0 to 1.0 indicating confidence of fraud likelihood.
    comment: str # A short explanation justifying the assessment.

# Define the input structure expected by the API handler
class FraudRequest(BaseModel):
    request_text: str