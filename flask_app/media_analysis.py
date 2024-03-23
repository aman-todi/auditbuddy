# Functions to deploy various computer vision tools on video footage

import os
import cv2
from flask_app.computer_vision.dectection_tracker import Tracker
from flask_app.computer_vision.car_detection import CarDetector
from flask_app.computer_vision.hospitality_assessment import HospitalityFinder
from flask_app.computer_vision.parking_detection import ParkingDetector
import firebase_admin
from firebase_admin import storage
import os
import time
import numpy as np

bucket = storage.bucket()

def save_frame(frame, frame_number, output_folder):
    # Saves a frame to the specified folder with a given frame number
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    filename = f"frame_{frame_number:04d}.jpg"
    filepath = os.path.join(output_folder, filename)
    cv2.imwrite(filepath, frame)


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
    total_cars = 0
    frame_counter = -1

    for media in files_list:

        # Process videos
        if media[-4:] in ['.MOV', '.mov', '.mp4']:
                
            # Load and segment video
            cap = cv2.VideoCapture(media)

            # Initialize car detector and tracker
            car_detector = CarDetector()
            car_tracker = Tracker(box_life = 31)

            display_frequency = 90  # Set the frequency of frames to save

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                # Increment the frame counter
                frame_counter += 1

                if frame_counter % 2 == 1: # Process only even frames
                    continue

                # Detect and track cars
                car_boxes = car_detector.detect_cars(frame)
                car_tracker.update(car_boxes)

                # Draw bounding boxes and save the frame only if the counter matches the display frequency
                if frame_counter % display_frequency in [0,1] or frame_counter == 0:
                    for box in car_boxes:
                        x, y, w, h = box
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                    save_frame_to_firebase(annotated_frame, frame_counter, 'CarResults',dealership_info)

            cars_count = car_tracker.get_total_count()
            print("Count of cars found: ", cars_count)
            total_cars += cars_count
            
            cap.release()

        # Process images
        else:
            frame = cv2.imread(media)

            car_detector = CarDetector() # Initialize car detector

            car_boxes = car_detector.detect_cars(frame) # Detect cars in the frame

            frame_counter += 1

            for box in car_boxes:
                x, y, w, h = box
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            save_frame_to_firebase(annotated_frame, frame_counter, 'CarResults',dealership_info)
            
            print("Count of cars found: ", len(car_boxes))
            total_cars += len(car_boxes)

    return total_cars


def assess_hospitality(files_list,dealership_info):
    # Build a list of hospitality indicators from videos
    total_seating = 0
    frame_counter = -1

    for media in files_list:
            
        # Process videos
        if media[-4:] in ['.MOV', '.mov', '.mp4']:

            # Initialize hospitality finder and seating tracker
            hospitality_finder = HospitalityFinder()
            seating_tracker = Tracker(box_life=29)

            # Load and segment video
            cap = cv2.VideoCapture(media)

            display_frequency = 60  # Set the frequency of frames to save

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                # Increment the frame counter
                frame_counter += 1

                if frame_counter % 2 == 1: # Process only even frames
                    continue

                # Find and track hospitality indicators
                seating_boxes = hospitality_finder.detect_seating(frame)
                seating_tracker.update(seating_boxes)

                # Draw bounding boxes and save the frame only if the counter matches the display frequency
                if frame_counter % display_frequency in [0,1] or frame_counter == 0:

                    # Draw boxes around seating areas
                    for box in seating_boxes:
                        x, y, w, h = box
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                    annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                    save_frame_to_firebase(annotated_frame, frame_counter, 'HospitalityResults',dealership_info)

            print("Count of seating found: ", seating_tracker.get_total_count())
            total_seating += seating_tracker.get_total_count()

            cap.release()

        # Process images
        else:
            frame = cv2.imread(media)

            hospitality_finder = HospitalityFinder() # Initialize hospitality finder

            seating_boxes = hospitality_finder.detect_seating(frame) # Detect seating

            frame_counter += 1

            for box in seating_boxes:
                x, y, w, h = box
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            save_frame_to_firebase(annotated_frame, frame_counter, 'HospitalityResults',dealership_info)
            
            print("Count of seating found: ", len(seating_boxes))
            total_seating += len(seating_boxes)            

    return total_seating


def count_parking_spaces(files_list,dealership_info):
    # Count the number of parking spaces for customers
    total_parking_spaces = 0
    frame_counter = -1

    for media in files_list:

        # Process videos
        if media[-4:] in ['.MOV', '.mov', '.mp4']:

            # Initialize parking detector and tracker
            parking_detector = ParkingDetector()
            parking_tracker = Tracker(box_life=30)

            # Load and segment video
            cap = cv2.VideoCapture(media)

            display_frequency = 90  # Set the frequency of frames to save

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                # Increment the frame counter
                frame_counter += 1

                if frame_counter % 2 == 1: # Process only even frames
                    continue

                # Detect and track parking spaces
                parking_class_ids, parking_confidences, parking_boxes = parking_detector.detect_parking(frame)
                parking_tracker.update(parking_boxes)

                # Draw bounding boxes and save the frame only if the counter matches the display frequency
                class_list = ['empty', 'occupied',]
                colors = [(255, 255, 0), (0, 255, 0), (0, 255, 255), (255, 0, 0)]
                
                if frame_counter % display_frequency in [0,1] or frame_counter == 0:
                    for (classid, confidence, box) in zip(parking_class_ids, parking_confidences, parking_boxes):
                        color = colors[int(classid) % len(colors)]
                        cv2.rectangle(frame, box, color, 2)
                        cv2.rectangle(frame, (box[0], box[1] - 20), (box[0] + box[2], box[1]), color, -1)
                        cv2.putText(frame, class_list[classid], (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, .5, (0,0,0))

                    annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                    save_frame_to_firebase(annotated_frame, frame_counter, 'ParkingResults',dealership_info)

            print("Count of parking spaces found: ", parking_tracker.get_total_count())
            total_parking_spaces += parking_tracker.get_total_count()
                
            cap.release()

        # Process images
        else:
            frame = cv2.imread(media)

            parking_detector = ParkingDetector() # Initialize parking detector

            parking_class_ids, parking_confidences, parking_boxes = parking_detector.detect_parking(frame) # Detect parking

            frame_counter += 1

            # Draw bounding boxes
            class_list = ['empty', 'occupied',]
            colors = [(255, 255, 0), (0, 255, 0), (0, 255, 255), (255, 0, 0)]

            for (classid, confidence, box) in zip(parking_class_ids, parking_confidences, parking_boxes):
                color = colors[int(classid) % len(colors)]
                cv2.rectangle(frame, box, color, 2)
                cv2.rectangle(frame, (box[0], box[1] - 20), (box[0] + box[2], box[1]), color, -1)
                cv2.putText(frame, class_list[classid], (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, .5, (0,0,0))

            annotated_frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            save_frame_to_firebase(annotated_frame, frame_counter, 'ParkingResults',dealership_info)           

            print("Count of parking spaces found: ", len(parking_boxes))
            total_parking_spaces += len(parking_boxes)                

    return total_parking_spaces