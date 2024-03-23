# Utilize Yolo to detect indicators of hospitality 

import numpy as np
import cv2

class HospitalityFinder:
    def __init__(self, confidence_threshold=0.7, nms_threshold=0.4):
        # Load YOLO model with given weights and cfg files
        self.net = cv2.dnn.readNet("flask_app/computer_vision/yolo/yolov3.weights", "flask_app/computer_vision/yolo/yolov3.cfg")
        layer_names = self.net.getLayerNames()
        # Get the output layer names used for the forward pass
        self.output_layers = [layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
        self.confidence_threshold = confidence_threshold  # Set confidence threshold for detection
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold

    def detect_seating(self, frame):
        # Detect indicators of hospitality in the frame
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

                # Calculate bounding box coordinates
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                # Check for seating: Bench, Chair, Couch
                if confidence > self.confidence_threshold and class_id in [13,56,57]:
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        # Apply Non-Maximum Suppression to filter overlapping boxes
        indices = cv2.dnn.NMSBoxes(boxes, confidences, self.confidence_threshold, self.nms_threshold)

        # Use list comprehension to filter boxes based on class ID
        seating_boxes = [boxes[i] for i in indices if class_ids[i] in [13,56,57]]

        return seating_boxes  # output seating detections