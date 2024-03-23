# Utilize results from computer vision analytics to build an audit score

import matplotlib.pyplot as plt
import numpy as np
import os
from flask import current_app as app
import firebase_admin
from firebase_admin import credentials, storage, firestore

import io
import cv2

# Evaluation factors ideal ratios
cars_ratio = 0.005
parking_ratio = 0.007
seating_ratio = 0.004
sq_footage_ratio = .025

bucket = storage.bucket()

db = firestore.client()

# push results from the database
def add_to_database(database_info,categories, scores,total_scores,detection,min_vals,expected_logo):

    print("TESTING MIN VALS",min_vals)

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
         "Detection" : detection,
         "Min Vals" : min_vals,
         "Expected Logo" : expected_logo,
         "Upload Name" : database_info[-1]

    }

    # go to the collection, create a new document (dealership name), create a new collection with (department)
    db.collection("results").document(database_info[1]).collection(database_info[2]).document(database_info[4]).set(data)
    

def build_audit_results(cv_results, dealership_info, past_sales=150, uio=300):
    # Extract results from various evaluations to build results

    detected_logo, num_cars, num_parking, num_seating, sq_footage = cv_results
    

    brand_compliance_limits = {}

    brand_limits_ref = db.collection('Brand compliance limits')

    for brand_doc in brand_limits_ref.stream():
        brand_data = brand_doc.to_dict()

        brand_name = brand_doc.id

        min_cars = brand_data.get('minCars')
        min_parking = brand_data.get('minParking')
        min_seating = brand_data.get('minSeating')
        min_sqft = brand_data.get('minSqFt')
        brand_compliance_limits[brand_name] = {'Min Cars': min_cars, "Min Parking": min_parking, "Min Seating": min_seating, "MinSqFt": min_sqft}
    brandName = dealership_info[0]
    cars_min = int(brand_compliance_limits[brandName]['Min Cars'])
    parking_min = int(brand_compliance_limits[brandName]['Min Parking'])
    seating_min = int(brand_compliance_limits[brandName]['Min Seating'])
    sq_footage_min = int(brand_compliance_limits[brandName]['MinSqFt'])
    print(cars_min, parking_min, seating_min, sq_footage_min)

    def calculate_evaluation_grades():
        # Grade the evaluation results using past sales and UIO information

        eval_factor = (past_sales + uio)//2
        minParkingFactor = int(num_parking)/int(parking_min) + 1
        minCarFactor = int(num_cars)/int(cars_min)+1
        minSeatingFactor = int(num_seating)/int(seating_min) +1
        minSqFactor = int(sq_footage)/int(sq_footage_min) +1
        grades = {}

        print("Past sales and UIO", past_sales,uio)
        print("Eval Factor",eval_factor)
        print("minParkingFactor", minParkingFactor)
        print("minCarFactor", minCarFactor)
        print("minSeatingFactor", minSeatingFactor)
        print("minSqFactor", minSqFactor)

        # Logo detection results
        if detected_logo.upper() == dealership_info[0].upper():
            logo_result = ('Great', 4, detected_logo)
        else:
            logo_result = ('Poor', 1, detected_logo)

        grades['Logo'] = logo_result

        # Cars display results
        if num_cars < cars_min:
            cars_result = ('Poor', 1, num_cars)

        elif num_cars < cars_min+(eval_factor*cars_ratio*minCarFactor):
            cars_result = ('Unsatisfactory', 2, num_cars)

        elif num_cars == cars_min+(eval_factor*cars_ratio*minCarFactor) or cars_min+(eval_factor*cars_ratio*minCarFactor*2):
            cars_result = ('Good', 3, num_cars)

        elif num_cars >= cars_min+(eval_factor*cars_ratio*minCarFactor*2):
            cars_result = ('Great', 4, num_cars)

        min_vals = (cars_min,cars_min+(eval_factor*cars_ratio*minCarFactor),cars_min+(eval_factor*cars_ratio*minCarFactor*2))
        cars_result = cars_result + min_vals
        grades['Cars'] = cars_result 

        # Customer parking results
        if num_parking < parking_min:
            parking_result = ('Poor', 1, num_parking)

        elif num_parking < parking_min+(eval_factor*parking_ratio*minParkingFactor):
            parking_result = ('Unsatisfactory', 2, num_parking)

        elif num_parking == parking_min+(eval_factor*parking_ratio*minParkingFactor) or parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
            parking_result = ('Good', 3, num_parking)

        elif num_parking >= parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
            parking_result = ('Great', 4, num_parking)

        min_vals = (parking_min,parking_min+(eval_factor*parking_ratio*minParkingFactor),parking_min+(eval_factor*parking_ratio*minParkingFactor*2))
        parking_result = parking_result + min_vals
        grades['Parking'] = parking_result

        # Hospitality results
        if num_seating < seating_min:
            seating_result = ('Poor', 1, num_seating)

        elif num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor):
            seating_result = ('Unsatisfactory', 2, num_seating)

        elif num_seating == seating_min+(eval_factor*seating_ratio*minSeatingFactor) or num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
            seating_result = ('Good', 3, num_seating)

        elif num_seating >= seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
            seating_result = ('Great', 4, num_seating)

        min_vals = (seating_min,seating_min+(eval_factor*seating_ratio*minSeatingFactor),seating_min+(eval_factor*seating_ratio*minSeatingFactor*2))
        seating_result = seating_result + min_vals
        grades['Hospitality'] = seating_result

        # Square footage results
        if sq_footage < sq_footage_min:
            sq_footage_result = ('Poor', 1, sq_footage)

        elif sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor):
            sq_footage_result = ('Unsatisfactory', 2, sq_footage)

        elif sq_footage == sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor) or sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
            sq_footage_result = ('Good', 3, sq_footage)

        elif sq_footage >= sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
            sq_footage_result = ('Great', 4, sq_footage)
        
        print("Test SQ FT", sq_footage_result)
        min_vals = (sq_footage_min,sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor),sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2))
        sq_footage_result = sq_footage_result + min_vals
        grades['Spatial'] = sq_footage_result

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
    categories = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial']
    scores = [grades[category][1] for category in categories]
    detection = [grades[category][2] for category in categories]

    min_vals = {}
    for category, values in grades.items():
        min_vals[category] = values[-3:]
    expected_logo = dealership_info[0].upper()

    grades = calculate_evaluation_grades()
    print("Grades by category: ", grades)



    add_to_database(dealership_info,categories,scores,total_score,detection,min_vals,expected_logo)
