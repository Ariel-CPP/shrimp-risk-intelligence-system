def classify_risk(score):
    if score < 0.3:
        return "Low"
    elif score <= 0.6:
        return "Medium"
    return "High"


def validate_data(df, features):
    missing = set(features) - set(df.columns)
    if missing:
        return False, f"Missing columns: {missing}"
    return True, "OK"
