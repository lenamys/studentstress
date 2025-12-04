from pydantic import BaseModel

class SurveyRequest(BaseModel):
    anxiety_level: int
    self_esteem: int
    mental_health_history: bool
    depression: int
    headache: int
    blood_pressure: int
    sleep_quality: int
    breathing_problem: int
    noise_level: int
    living_conditions: int
    safety: int
    basic_needs: int
    academic_performance: int
    study_load: int
    teacher_student_relationship: int
    future_career_concerns: int
    social_support: int
    peer_pressure: int
    extracurricular_activities: int
    bullying: int

    class Config:
        orm_mode = True  # Allows SQLAlchemy models to be returned as Pydantic objects if needed