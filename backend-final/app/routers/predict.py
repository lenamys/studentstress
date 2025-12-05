from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from time import time

from app.db.database import get_db
from app.models.survey import Survey
from app.schemas.survey_schema import SurveyRequest

from app.ml.model import model, regression_model, rf_model, scaler, regression_scaler, rf_scaler
from app.ml.preprocess import preprocess_input

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
        
        # Calculate time for preprocessing, prediction, and total time for benchmark
        t0 = time()
        # First Preprocess the feature first to ensure safety
        raw_features = preprocess_input(data_dict)
        
        ada_features = scaler.transform([raw_features])[0]
        reg_features = regression_scaler.transform([raw_features])[0]
        rf_features  = rf_scaler.transform([raw_features])[0]
        preprocess_time = round(time() - t0, 6)
        
        # Proceed with ML main prediction (Adaboost Model)
        t1 = time()
        main_pred = model.predict([ada_features])[0]
        main_stress_type = MAPPING.get(main_pred, "no stress")
        adaboost_time = round(time() - t1, 6)
        logger.info(f"Prediction result: {main_stress_type}")
        
        # Predict using Regression
        t2 = time()
        regression_pred = regression_model.predict([reg_features])[0]
        regression_stress_type = MAPPING.get(regression_pred, "no stress")
        regression_time = round(time() - t2, 6)
        
        # Predict using Random Forest
        t3 = time()
        rf_pred = rf_model.predict([rf_features])[0]
        rf_stress_type = MAPPING.get(rf_pred, "no stress")
        rf_time = round(time() - t3, 6)
        
        total_time = round(time() - t0, 6)
        
        # Build JSONB to store time
        time_data = {
            "preprocess" : preprocess_time,
            "adaboost_prediction" : adaboost_time,
            "regression_prediction" : regression_time,
            "rf_prediction" : rf_time,
            "total" : total_time
        }
        
        # Save survey to database
        survey = Survey(
            **data_dict, 
            main_prediction_result = main_stress_type,
            regression_prediction_result = regression_stress_type,
            rf_prediction_result = rf_stress_type,
            prediction_time = time_data
            )
        
        db.add(survey)
        db.commit()
        db.refresh(survey)
        logger.info(f"Survey saved: {survey.id}, main_prediction={main_stress_type}")
        
        return{"stress_level": main_stress_type}
        
    except Exception as e:
        # Log the error
        logger.error(f"Error in /predict: {str(e)}", exc_info=True)
        # Return HTTP 500 response with error message
        raise HTTPException(
            status_code=500, 
            detail="Internal server error. Please try again later.")