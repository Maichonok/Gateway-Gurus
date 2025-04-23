from pydantic import BaseModel

# Define the output structure for fraud detection
class FraudDetection(BaseModel):
    fraud: int
    score: float
    comment: str

# Define the input structure expected by the API handler
class FraudRequest(BaseModel):
    email: str