# Functions to deploy various computer vision tools on video footage

import os
import cv2
from flask_app.computer_vision.tracker import Tracker
from flask_app.computer_vision.car_detection import CarDetector
from flask_app.computer_vision.hospitality_assessment import HospitalityFinder
from flask_app.computer_vision.parking_detection import detect_parking_spaces

def save_frame(frame, frame_number, output_folder):
    # Saves a frame to the specified folder with a given frame number
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    filename = f"frame_{frame_number:04d}.jpg"
    filepath = os.path.join(output_folder, filename)
    cv2.imwrite(filepath, frame)


def count_cars_in_footage(path_to_video):
    # Compute the number of distinct cars in a video

    # Initialize car detector and tracker
    car_detector = CarDetector()
    car_tracker = Tracker(distance_threshold=145)

    # Load and segment video
    cap = cv2.VideoCapture(path_to_video)

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
            save_frame(frame, frame_counter, 'car_frames')
        
    print("Count of cars found: ", car_tracker.get_total_count())

    cap.release()


def assess_hospitality(path_to_video):
    # Build a list of hospitality indicators

    # HOSPITALITY
    hospitality_finder = HospitalityFinder()
    # Initialize beverage (class 1) tracker
    beverage_tracker = Tracker(distance_threshold=120)
    # Initialize snacks (class 2) tracker
    snacks_tracker = Tracker(distance_threshold=120)
    # Initialize seating (class 3) tracker
    seating_tracker = Tracker(distance_threshold=160)

    # Load and segment video
    cap = cv2.VideoCapture(path_to_video)

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

            save_frame(frame, frame_counter, 'hospitality_frames')
        
    print("Count of beverages found: ", beverage_tracker.get_total_count())
    print("Count of snacks found: ", snacks_tracker.get_total_count())
    print("Count of seating found: ", seating_tracker.get_total_count())

    cap.release()


def count_parking_spaces(path_to_video):
    # Count the number of parking spaces for customers
    parking_tracker = Tracker(distance_threshold=175)

    cap = cv2.VideoCapture(path_to_video)

    frame_counter = 0
    display_frequency = 50  # Set the frequency of frames to save

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Increment the frame counter
        frame_counter += 1

        # Detect parking spaces in the current frame
        parking_boxes = detect_parking_spaces(frame)
        
        # Update tracker with detected boxes
        parking_tracker.update(parking_boxes)

        # Draw bounding boxes and save the frame only if the counter matches the display frequency
        if frame_counter % display_frequency == 0 or frame_counter == 1:
            for box in parking_boxes:
                x, y, w, h = box
                cv2.rectangle(frame, (int(x), int(y)), (int(x + w), int(y + h)), (0, 255, 0), 2)
            save_frame(frame, frame_counter, 'parking_frames')

    print("Number of parking spaces: ", parking_tracker.get_total_count())

    cap.release()

