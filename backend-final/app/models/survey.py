from sqlalchemy import Column, Integer, Boolean, String, TIMESTAMP, func
from .models import Base  

class Survey(Base):
    __tablename__ = "survey"

    id = Column(Integer, primary_key=True, index=True)
    anxiety_level = Column(Integer)
    self_esteem = Column(Integer)
    mental_health_history = Column(Boolean)
    depression = Column(Integer)
    headache = Column(Integer)
    blood_pressure = Column(Integer)
    sleep_quality = Column(Integer)
    breathing_problem = Column(Integer)
    noise_level = Column(Integer)
    living_conditions = Column(Integer)
    safety = Column(Integer)
    basic_needs = Column(Integer)
    academic_performance = Column(Integer)
    study_load = Column(Integer)
    teacher_student_relationship = Column(Integer)
    future_career_concerns = Column(Integer)
    social_support = Column(Integer)
    peer_pressure = Column(Integer)
    extracurricular_activities = Column(Integer)
    bullying = Column(Integer)
    prediction_result = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.now())