# Utilize results from computer vision analytics to build an audit score

import matplotlib.pyplot as plt
import numpy as np
from firebase_admin import storage

# Evaluation factors ideal ratios
cars_ratio = 0.05
parking_ratio = 0.10
seating_ratio = 0.08
sq_footage_ratio = 25

# Evaluation factors min
cars_min = 8
parking_min = 10
seating_min = 6
sq_footage_min = 500


def build_audit_results(cv_results, dealership_info, past_sales=150, uio=300):
    # Extract results from various evaluations to build results

    detected_logo, num_cars, num_parking, num_seating, sq_footage = cv_results

    def calculate_evaluation_grades():
        # Grade the evaluation results using past sales and UIO information

        eval_factor = (past_sales + uio)//2

        grades = {}

        # Logo detection results
        if detected_logo.upper() == dealership_info[0].upper():
            logo_result = ('Great', 4, detected_logo)
        else:
            logo_result = ('Poor', 1, detected_logo)

        grades['Logo'] = logo_result

        # Cars display results
        if num_cars < cars_min:
            cars_result = ('Poor', 1, num_cars)

        elif num_cars < eval_factor*cars_ratio:
            cars_result = ('Unsatisfactory', 2, num_cars)

        elif num_cars == eval_factor*cars_ratio or num_cars < eval_factor*cars_ratio + 5:
            cars_result = ('Good', 3, num_cars)

        elif num_cars >= eval_factor*cars_ratio + 5:
            cars_result = ('Great', 4, num_cars)

        grades['Cars'] = cars_result

        # Customer parking results
        if num_parking < parking_min:
            parking_result = ('Poor', 1, num_parking)

        elif num_parking < eval_factor*parking_ratio:
            parking_result = ('Unsatisfactory', 2, num_parking)

        elif num_parking == eval_factor*parking_ratio or num_parking < eval_factor*parking_ratio + 10:
            parking_result = ('Good', 3, num_parking)

        elif num_parking >= eval_factor*parking_ratio + 10:
            parking_result = ('Great', 4, num_parking)

        grades['Parking'] = parking_result

        # Hospitality results
        if num_seating < seating_min:
            seating_result = ('Poor', 1, num_seating)

        elif num_seating < eval_factor*seating_ratio:
            seating_result = ('Unsatisfactory', 2, num_seating)

        elif num_seating == eval_factor*seating_ratio or num_seating < eval_factor*seating_ratio + 6:
            seating_result = ('Good', 3, num_seating)

        elif num_seating >= eval_factor*seating_ratio + 6:
            seating_result = ('Great', 4, num_seating)

        grades['Hospitality'] = seating_result

        # Square footage results
        if sq_footage < sq_footage_min:
            sq_footage_result = ('Poor', 1, sq_footage)

        elif sq_footage < eval_factor*sq_footage_ratio:
            sq_footage_result = ('Unsatisfactory', 2, sq_footage)

        elif sq_footage == eval_factor*sq_footage_ratio or sq_footage < eval_factor*sq_footage_ratio + 6:
            sq_footage_result = ('Good', 3, sq_footage)

        elif sq_footage >= eval_factor*sq_footage + 6:
            sq_footage_result = ('Great', 4, sq_footage)

        grades['Square Ft'] = sq_footage_result

        return grades   
    
    grades = calculate_evaluation_grades()
    print("Grades by category: ", grades)

    qualitative_scale = {1: 'Poor', 2: 'Unsatisfactory', 3: 'Good', 4: 'Great'}    

    def calculate_overall_score():
        # Build an overall score using grades from different evaluations
        total_score = 0

        for grade in grades.values():
            total_score += grade[1]

        final_grade = total_score // 5
        final_grade = qualitative_scale[final_grade]

        return total_score, final_grade
    
    total_score, final_grade = calculate_overall_score()
    print("Total score: ", total_score)
    print("Overall grade: ", final_grade)

    # Extract categories and their scores
    categories = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Square Ft']
    scores = [grades[category][1] for category in categories]

    def visualize_category_eval():
        # Create a bar plot to visualize performance by category
        plt.figure(figsize=(10, 6))
        y_pos = np.arange(len(categories))
        plt.bar(y_pos, scores, align='center', alpha=0.5, color='b')
        plt.xticks(y_pos, categories)
        plt.xlabel('Categories')
        plt.ylabel('Scores')
        plt.yticks(np.arange(0, 5), ['0', 'Poor', 'Unsatisfactory', 'Good', 'Great'])
        plt.title('Evaluation Grades by Category')
        plt.show()

    visualize_category_eval()

    def visualize_overall_score(max_score=16):
        # Create a pie chart to visualize overall performance
        plt.figure(figsize=(6, 6))
        labels = [f'Score {total_score}', f'Remaining {max_score - total_score}']
        sizes = [total_score, max_score - total_score]
        colors = ['#467be3', '#e9edf7']
        plt.pie(sizes, labels=labels, colors=colors, startangle=90, autopct='%1.1f%%')
        plt.title('Overall Score')
        plt.show()

    visualize_overall_score()






    