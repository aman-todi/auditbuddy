# Utilize Yolo to detect indicators of hospitality 

import numpy as np
import cv2

class HospitalityFinder:
    def __init__(self, confidence_threshold=0.6, nms_threshold=0.4):
        # Load YOLO model with given weights and cfg files
        self.net = cv2.dnn.readNet("flask_app/computer_vision/yolo/yolov3.weights", "flask_app/computer_vision/yolo/yolov3.cfg")
        layer_names = self.net.getLayerNames()
        # Get the output layer names used for the forward pass
        self.output_layers = [layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
        self.confidence_threshold = confidence_threshold  # Set confidence threshold for detection
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold

    def detect_indicators(self, frame):
        # Detect indicators of hospitality in the frame
        height, width, _ = frame.shape
        # Convert frame to blob format for DNN input
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        self.net.setInput(blob)
        outs = self.net.forward(self.output_layers)  # Perform a forward pass and get output

        # Segregate hospitality indicators by class
        # Beverage (class 1): Bottle, Wine Glass, Cup - 40,41,42
        # Snacks (class 2) : Bowl, Banana, Apple, Sandwich, Orange, Broccoli, Carrot, Hot dog, Pizza, Donut, Cake - [46,56]
        # Seating (class 3): Bench, Chair, Couch - 14,57,58

        class_ids_1 = []
        confidences_1 = []
        boxes_1 = []

        class_ids_2 = []
        confidences_2 = []
        boxes_2 = []

        class_ids_3 = []
        confidences_3 = []
        boxes_3 = []

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

                # Check for beverages (class 1)
                if confidence > self.confidence_threshold and class_id in [40,41,42]:
                    boxes_1.append([x, y, w, h])
                    confidences_1.append(float(confidence))
                    class_ids_1.append(class_id)

                # Check for snacks (class 2)
                elif confidence > self.confidence_threshold and 46 <= class_id <= 56:
                    boxes_2.append([x, y, w, h])
                    confidences_2.append(float(confidence))
                    class_ids_2.append(class_id)

                # Check for seating (class 3)
                elif confidence > self.confidence_threshold and [14,57,58]:
                    boxes_3.append([x, y, w, h])
                    confidences_3.append(float(confidence))
                    class_ids_3.append(class_id)

        # Apply Non-Maximum Suppression to filter overlapping boxes
        indices_1 = cv2.dnn.NMSBoxes(boxes_1, confidences_1, self.confidence_threshold, self.nms_threshold)
        indices_2 = cv2.dnn.NMSBoxes(boxes_2, confidences_2, self.confidence_threshold, self.nms_threshold)
        indices_3 = cv2.dnn.NMSBoxes(boxes_3, confidences_3, self.confidence_threshold, self.nms_threshold)

        # Use list comprehension to filter boxes based on class ID
        boxes_1 = [boxes_1[i] for i in indices_1 if class_ids_1[i] in [40,41,42]]
        boxes_2 = [boxes_2[i] for i in indices_2 if 46 <= class_ids_2[i] <= 56]
        boxes_3 = [boxes_3[i] for i in indices_3 if class_ids_3[i] in [14,57,58]]

        return boxes_1, boxes_2, boxes_3  # Return 3 sets of boxes for each of the classes: beverages, snacks, and seating