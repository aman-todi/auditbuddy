# Tracker class to track an object across frames in a video

import numpy as np

class Tracker:
    # allow user to customize the distance threshold depending on the object size
    def __init__(self, distance_threshold=100):
        self.next_id = 0
        self.objects = {}  # Stores object ID and its centroid
        self.distance_threshold = distance_threshold  # Threshold for considering object as matched

    def update(self, boxes):
        # Update the tracker based on detected boxes
        for box in boxes:
            # Calculate the centroid of the new detection
            x, y, w, h = box
            centroid = (int(x + w / 2), int(y + h / 2))

            # If there are no objects currently tracked, add this as a new object
            if not self.objects: 
                self.objects[self.next_id] = centroid
                self.next_id += 1
                continue

            # Check if the new detection matches any existing tracked objects
            if not any(np.linalg.norm(np.array(obj_centroid) - np.array(centroid)) < self.distance_threshold 
                       for obj_centroid in self.objects.values()):
                
                # If the object does not match existing objects, consider it as a new distinct object
                self.objects[self.next_id] = centroid
                self.next_id += 1

    def get_total_count(self):
        # Return the total number of distinct objects detected throughout the video
        return self.next_id
