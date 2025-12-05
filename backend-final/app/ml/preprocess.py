from typing import List

# Preprocess the input dictionary, ensure feature in correct order
def preprocess_input(data: dict) -> List[float]:
    feature_order = [
        "anxiety_level", "self_esteem", "mental_health_history",
        "depression", "headache", "blood_pressure", "sleep_quality",
        "breathing_problem", "noise_level", "living_conditions",
        "safety", "basic_needs", "academic_performance", "study_load",
        "teacher_student_relationship", "future_career_concerns",
        "social_support", "peer_pressure", "extracurricular_activities",
        "bullying"
    ]
    
    # Set default as 0
    features = [data.get(f, 0) for f in feature_order]
    
    # Make sure to return back in 1D array
    return features