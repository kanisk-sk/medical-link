from app.schemas.schemas import TriageRequest, TriageResponse

RED_FLAGS = [
  "chest pain", "ਛਾਤੀ ਵਿੱਚ ਦਰਦ", "छाती में दर्द",
  "shortness of breath", "ਸਾਹ ਫੁੱਲਦਾ", "सांस फूलना",
  "unconscious", "ਬੇਹੋਸ਼", "बेहोश"
]

def analyze_triage(request: TriageRequest) -> TriageResponse:
    text = request.raw_speech.lower()
    alerts = []
    extracted = []
    is_red_flag = False

    for rf in RED_FLAGS:
        if rf in text:
            is_red_flag = True
            alerts.append(f"Critical symptom detected: '{rf}'")
            extracted.append({"text": rf, "category": "emergency", "isRedFlag": True})

    if request.vitals:
        if request.vitals.spo2 and request.vitals.spo2 < 90:
            is_red_flag = True
            alerts.append(f"CRITICAL HYPOXIA: SpO2 {request.vitals.spo2}% < 90%")
        if request.vitals.blood_pressure_systolic and request.vitals.blood_pressure_systolic > 160:
            is_red_flag = True
            alerts.append(f"HYPERTENSIVE CRISIS: Systolic BP {request.vitals.blood_pressure_systolic} mmHg")

    priority = "HIGH" if (is_red_flag or len(alerts) >= 2) else "MEDIUM" if len(text) > 0 else "LOW"

    return TriageResponse(
        priority=priority,
        is_red_flag=is_red_flag,
        alerts=alerts,
        extracted_symptoms=extracted
    )
