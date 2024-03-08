# Utilize custom YOLO model to detect parking spaces

import cv2
import numpy as np

class ParkingDetector:
    def __init__(self, confidence_threshold=0.1, nms_threshold=0.4):
        # Load YOLO model with ONNX weights
        self.net = cv2.dnn.readNet("flask_app/computer_vision/parking_weights.onnx")
        self.score_threshold = 0.2
        self.confidence_threshold = confidence_threshold  # Set confidence threshold
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold
        self.input_width = 640
        self.input_height = 640

    def preprocess(self,frame):
        # preprocess the image for better reading
        row, col, _ = frame.shape
        _max = max(col, row)
        result = np.zeros((_max, _max, 3), np.uint8)
        result[0:row, 0:col] = frame
        return result

    def detect_parking(self, frame):
        # Detect parking spaces in the given frame
        frame = self.preprocess(frame)

        # Convert frame to blob format for DNN input
        blob = cv2.dnn.blobFromImage(frame, 1/255.0, (self.input_height, self.input_width), swapRB=True, crop=False)
        self.net.setInput(blob)
        outs = self.net.forward()
        pred = outs[0]

        class_ids = []
        confidences = []
        boxes = []

        rows = pred.shape[0]

        image_width, image_height, _ = frame.shape

        # Adjust the frame dimensions for compatibility with model
        x_factor = image_width / self.input_width
        y_factor =  image_height / self.input_height

        for r in range(rows):
            row = pred[r]
            confidence = row[4]
            if confidence >= self.confidence_threshold:

                classes_scores = row[5:]
                _, _, _, max_indx = cv2.minMaxLoc(classes_scores)
                class_id = max_indx[1]
                confidences.append(confidence)
                class_ids.append(class_id)

                # Extract box coordinates of detections
                x, y, w, h = row[0].item(), row[1].item(), row[2].item(), row[3].item() 
                left = int((x - 0.5 * w) * x_factor)
                top = int((y - 0.5 * h) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)
                box = np.array([left, top, width, height])
                boxes.append(box)

        # Apply Non Maximum Suppression
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, self.confidence_threshold, self.nms_threshold) 

        parking_class_ids = []
        parking_confidences = []
        parking_boxes = []

        # Prepare boxes and IDs of detections to return
        for i in indexes:
            parking_confidences.append(confidences[i])
            parking_class_ids.append(class_ids[i])
            parking_boxes.append(boxes[i])

        return parking_class_ids, parking_confidences, parking_boxes