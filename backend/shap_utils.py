import shap

def get_shap_values(model, X):
    explainer = shap.TreeExplainer(model)
    return explainer(X)
