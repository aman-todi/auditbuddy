# Functions to deploy various computer vision tools on video footage

import os
import cv2
from flask_app.computer_vision.tracker import Tracker
from flask_app.computer_vision.car_detection import CarDetector
from flask_app.computer_vision.hospitality_assessment import HospitalityFinder
from flask_app.computer_vision.parking_detection import detect_parking_spaces
import firebase_admin
from firebase_admin import storage
import os
import time
import numpy as np

bucket = storage.bucket()

# def save_frame(frame, frame_number, output_folder):
#     # Saves a frame to the specified folder with a given frame number
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)
#     filename = f"frame_{frame_number:04d}.jpg"
#     filepath = os.path.join(output_folder, filename)
#     cv2.imwrite(filepath, frame)


def save_frame_to_firebase(frame,frame_number,output_folder,dealership_info):
    print("Saving annotated image to Firebase")
    # Specify the path where you want to store the file in Firebase Storage
    image_filename = f"{dealership_info[0]}/{dealership_info[1]}/{dealership_info[2]}/{dealership_info[4]}/{output_folder}/frame_{frame_number:04d}.png"
    blob = bucket.blob(image_filename)
    # Convert the OpenCV image to bytes
    _, buffer = cv2.imencode('.png', frame)
    # Upload the file to Firebase Storage
    blob.upload_from_string(buffer.tobytes(), content_type='image/png')
    print(f'Saved annotated image to Firebase Storage: {blob.public_url}')


def count_cars_in_footage(files_list,dealership_info):
    # Compute the number of distinct cars from multiple videos

    # Initialize car detector and tracker
    car_detector = CarDetector()
    car_tracker = Tracker(distance_threshold=230)

    for video in files_list:
        # Load and segment video
        cap = cv2.VideoCapture(video)

        frame_counter = 0
        display_frequency = 50  # Set the frequency of frames to save

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Increment the frame counter
            frame_counter += 1

            # Detect and track cars
            car_boxes = car_detector.detect_cars(frame)
            car_tracker.update(car_boxes)

            # Draw bounding boxes and save the frame only if the counter matches the display frequency
            if frame_counter % display_frequency == 0 or frame_counter == 1:
                for box in car_boxes:
                    x, y, w, h = box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                save_frame_to_firebase(annotated_frame, frame_counter, 'CarResults',dealership_info)
            
        cap.release()

    print("Count of cars found: ", car_tracker.get_total_count())


def assess_hospitality(files_list,dealership_info):
    # Build a list of hospitality indicators from videos

    # HOSPITALITY
    hospitality_finder = HospitalityFinder()
    # Initialize beverage (class 1) tracker
    beverage_tracker = Tracker(distance_threshold=120)
    # Initialize snacks (class 2) tracker
    snacks_tracker = Tracker(distance_threshold=120)
    # Initialize seating (class 3) tracker
    seating_tracker = Tracker(distance_threshold=200)

    for video in files_list:

        # Load and segment video
        cap = cv2.VideoCapture(video)

        frame_counter = 0
        display_frequency = 50  # Set the frequency of frames to save

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Increment the frame counter
            frame_counter += 1

            # Find and track hospitality indicators
            beverage_boxes, snacks_boxes, seating_boxes = hospitality_finder.detect_indicators(frame)
            beverage_tracker.update(beverage_boxes)
            snacks_tracker.update(snacks_boxes)
            seating_tracker.update(seating_boxes)

            # Draw bounding boxes and save the frame only if the counter matches the display frequency
            if frame_counter % display_frequency == 0 or frame_counter == 1:

                # Draw boxes around beverages
                for box in beverage_boxes:
                    x, y, w, h = box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                # Draw boxes around snacks
                for box in snacks_boxes:
                    x, y, w, h = box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                # Draw boxes around seating areas
                for box in seating_boxes:
                    x, y, w, h = box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                save_frame_to_firebase(annotated_frame, frame_counter, 'HospitalityResults',dealership_info)

        cap.release()

    print("Count of beverages found: ", beverage_tracker.get_total_count())
    print("Count of snacks found: ", snacks_tracker.get_total_count())
    print("Count of seating found: ", seating_tracker.get_total_count())


def count_parking_spaces(files_list):
    # Count the number of parking spaces for customers

    # ORIGINAL CODE, REVERT TO THIS AFTER TRAINING OF MODEL FINISHES
    # parking_tracker = Tracker(distance_threshold=175)

    # for video in files_list:
    #     cap = cv2.VideoCapture(video)

    #     frame_counter = 0
    #     display_frequency = 50  # Set the frequency of frames to save

    #     while True:
    #         ret, frame = cap.read()
    #         if not ret:
    #             break

    #         # Increment the frame counter
    #         frame_counter += 1

    #         # Detect parking spaces in the current frame
    #         parking_boxes = detect_parking_spaces(frame)
            
    #         # Update tracker with detected boxes
    #         parking_tracker.update(parking_boxes)

    #         # Draw bounding boxes and save the frame only if the counter matches the display frequency
    #         if frame_counter % display_frequency == 0 or frame_counter == 1:
    #             for box in parking_boxes:
    #                 x, y, w, h = box
    #                 cv2.rectangle(frame, (int(x), int(y)), (int(x + w), int(y + h)), (0, 255, 0), 2)
    #             save_frame(frame, frame_counter, 'parking_frames')

    #     cap.release()
    
    # print("Number of parking spaces: ", parking_tracker.get_total_count())


    # REMOVE CODE BELOW THIS LINE AFTER MODEL IS READY
    parking_counter = 0

    for image in files_list:
        parking_counter += detect_parking_spaces(image)

    print("Number of parking spaces: ", parking_counter)

