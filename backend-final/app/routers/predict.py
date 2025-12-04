from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.survey import Survey
from app.schemas.survey_schema import SurveyRequest

from app.ml.model import model, scaler
from app.ml.preprocess import preprocess_input
from sklearn.metrics import f1_score

import logging

router = APIRouter()

# For logging
logging.basicConfig(
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ---------- Configuration ----------
MAPPING = {
    0: "no stress",
    1: "eustress",
    2: "distress"
}
# -----------------------------------

@router.post("/predict")
async def predict_survey(data: SurveyRequest, db: Session = Depends(get_db)):
    try:
        data_dict = data.dict()
        
        # First Preprocess the feature first to ensure safety
        features = preprocess_input(data_dict, scaler)
        
        # Proceed with ML prediction
        predictions = model.predict([features])[0]
        stress_type = MAPPING.get(predictions, "no stress")
        logger.info(f"Prediction result: {stress_type}")
        
        # Save survey to database
        survey = Survey(**data_dict, prediction_result = stress_type)
        db.add(survey)
        db.commit()
        db.refresh(survey)
        logger.info(f"Survey saved: {survey.id}, prediction={stress_type}")
        
        return{"stress_level": stress_type}
        
    except Exception as e:
        # Log the error
        logger.error(f"Error in /predict: {str(e)}", exc_info=True)
        # Return HTTP 500 response with error message
        raise HTTPException(
            status_code=500, 
            detail="Internal server error. Please try again later.")