# Utilize results from computer vision analytics to build an audit score

def build_audit_score(cv_results, past_sales=150, uio=300):
    # Extract results from various computer vision tasks to score dealership

    logo_result, num_cars, num_parking, hosp_finders, sq_footage = cv_results

    pass