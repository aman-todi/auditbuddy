# Utilize Yolo to detect cars in frames from dealership footage

import numpy as np
import cv2

class CarDetector:
    def __init__(self, confidence_threshold=0.6, nms_threshold=0.4):
        # Load YOLO model with given weights and cfg files
        self.net = cv2.dnn.readNet("flask_app/computer_vision/yolo/yolov3.weights", "flask_app/computer_vision/yolo/yolov3.cfg")
        layer_names = self.net.getLayerNames()
        # Get the output layer names used for the forward pass
        self.output_layers = [layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
        self.confidence_threshold = confidence_threshold  # Set confidence threshold for detection
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold

    def detect_cars(self, frame):
        # Detect cars in the given frame
        height, width, _ = frame.shape
        # Convert frame to blob format for DNN input
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        self.net.setInput(blob)
        outs = self.net.forward(self.output_layers)  # Perform a forward pass and get output

        class_ids = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                # Extract class scores and class id
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                # Check if detection is of a car (id 2) or truck (id 7) and meets the confidence threshold
                if confidence > self.confidence_threshold and (class_id == 2 or class_id == 7):
                    # Calculate bounding box coordinates
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        # Apply Non-Maximum Suppression to filter overlapping boxes
        indices = cv2.dnn.NMSBoxes(boxes, confidences, self.confidence_threshold, self.nms_threshold)

        # Use list comprehension to filter car boxes based on class ID
        car_boxes = [boxes[i] for i in indices if class_ids[i] == 2]  # Filter out non-car objects

        return car_boxes  # Return boxes of detected cars