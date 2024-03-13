# Utilize results from computer vision analytics to build an audit score

import matplotlib.pyplot as plt
import numpy as np
import os
from flask import current_app as app
import firebase_admin
from firebase_admin import storage
import io
import cv2

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

bucket = storage.bucket()

# firestore for saving to results
from firebase_admin import credentials, storage, firestore
db = firestore.client()

# add the form submission and grades to the database
def add_to_database(database_info, categories, scores, total_scores):
    # append the new data in the correct format for firebase
    data = {
        # add the submission date here
        "Submitted": database_info[4],
        "Dealership Name": database_info[1],
        "Brand": database_info[0],
        "Department": database_info[2],
        "Country": database_info[3],
        "UID": database_info[5],
        "Category Eval": {
            "Categories": categories,
            "Scores": scores
        },
        "Overall Eval" : {
            "Scores": total_scores
        },
    }

    # go to the collection, create a new document (dealership name), create a new collection with (department)
    db.collection("results").document(database_info[1]).collection(database_info[2]).document(database_info[4]).set(data)

def upload_to_firebase(file_bytes, file_name):
    # Upload bytes to Firebase Storage
    blob = bucket.blob(file_name)
    blob.upload_from_string(file_bytes.getvalue(), content_type='image/png')
    print(f'Saved annotated image to Firebase Storage: {blob.public_url}')

def visualize_category_eval(dealership_info, categories, scores):
    # Create a bar plot to visualize performance by category
    fig, ax = plt.subplots(figsize=(10, 6))
    y_pos = np.arange(len(categories))
    ax.bar(y_pos, scores, align='center', alpha=0.5, color='b')
    ax.set_xticks(y_pos)
    ax.set_xticklabels(categories)
    ax.set_xlabel('Categories')
    ax.set_ylabel('Scores')
    ax.set_yticks(np.arange(0, 5))
    ax.set_yticklabels(['0', 'Poor', 'Unsatisfactory', 'Good', 'Great'])
    ax.set_title('Evaluation Grades by Category')

    # Generate a temporary file to save the plot
    file_path = f"{dealership_info[0]}/{dealership_info[1]}/{dealership_info[2]}/{dealership_info[4]}/GraphResults/visualization_bar.png"
    image_bytes = io.BytesIO()
    plt.savefig(image_bytes, format='png')
    image_bytes.seek(0)

    # Upload the bytes to Firebase Storage
    upload_to_firebase(image_bytes, file_path)

    plt.close(fig)



def visualize_overall_score(dealership_info, total_score, max_score=16):
    # Create a pie chart to visualize overall performance
    fig, ax = plt.subplots(figsize=(6, 6))
    labels = [f'Score {total_score}', f'Remaining {max_score - total_score}']
    sizes = [total_score, max_score - total_score]
    colors = ['#467be3', '#e9edf7']
    ax.pie(sizes, labels=labels, colors=colors, startangle=90, autopct='%1.1f%%')
    ax.set_title('Overall Score')

    file_path = f"{dealership_info[0]}/{dealership_info[1]}/{dealership_info[2]}/{dealership_info[4]}/GraphResults/visualization_pie.png"
    image_bytes = io.BytesIO()
    plt.savefig(image_bytes, format='png')
    image_bytes.seek(0)

    # Upload the bytes to Firebase Storage
    upload_to_firebase(image_bytes, file_path)

    plt.close(fig)




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

    grades = calculate_evaluation_grades()
    print("Grades by category: ", grades)

    # Extract categories and their scores
    categories = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Square Ft']
    scores = [grades[category][1] for category in categories]

    visualize_category_eval(dealership_info, categories, scores)
    visualize_overall_score(dealership_info, total_score)
    add_to_database(dealership_info, categories, scores, total_score)
