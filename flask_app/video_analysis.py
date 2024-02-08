# Functions to deploy various computer vision tools on video footage

import os
import cv2
from flask_app.computer_vision.tracker import Tracker
from flask_app.computer_vision.car_detection import CarDetector

def save_frame(frame, frame_number, output_folder='car_frames'):
    print("save frame is called")
    # Saves a frame to the specified folder with a given frame number
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    filename = f"frame_{frame_number:04d}.jpg"
    filepath = os.path.join(output_folder, filename)
    cv2.imwrite(filepath, frame)

def deploy_cvision_tools(path_to_video):
    print("Deploy cvision is called")

    # Initialize car detector and tracker
    car_detector = CarDetector()
    car_tracker = Tracker(distance_threshold=145)

    # Load and segment video
    cap = cv2.VideoCapture(path_to_video)

    frame_counter = 0
    display_frequency = 40  # Set the frequency of frames to save

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
            save_frame(frame, frame_counter)
        
    print("Count of cars found: ", car_tracker.get_total_count())

    cap.release()
