from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI app
app = FastAPI(title="Loan Eligibility AI", description="FinBERT-powered loan eligibility assessment.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)
# Load the pretrained financial model (FinBERT)
try:
    model_pipeline = pipeline("text-classification", model="ProsusAI/finbert")
except Exception as e:
    raise RuntimeError(f"Error loading AI model: {str(e)}")

# Define Loan Application Schema
class LoanApplication(BaseModel):
    user_data: dict  # Accepts dynamic key-value pairs instead of hardcoded fields

@app.post("/loan-eligibility/")
async def get_loan_eligibility(application: LoanApplication):
    """
    Uses FinBERT (a pretrained financial model) to analyze loan eligibility dynamically.
    """
    try:
        # Dynamically construct input from received JSON
        input_text = "The user provided the following financial information:\n"
        input_text += "\n".join([f"- {key}: {value}" for key, value in application.user_data.items()])
        input_text += "\nAnalyze and assess their loan eligibility."

        # Get AI model prediction
        result = model_pipeline(input_text)

        # Map FinBERT output to human-readable categories
        label_mapping = {
            "positive": "Highly Eligible",
            "neutral": "Moderately Eligible",
            "negative": "Not Eligible"
        }

        recommendation = label_mapping.get(result[0]['label'], "Uncertain")

        return {
            "Loan Eligibility Score": round(result[0]['score'] * 100, 2),
            "Recommendation": recommendation,
            "AI Justification": f"The AI model classified this case as {result[0]['label']}."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"FinBERT Model Error: {str(e)}")
