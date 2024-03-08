# Tracker class to track an object across frames in a video

import numpy as np
import copy

class Tracker:
    # allow user to customize the distance threshold depending on the object size
    def __init__(self, distance_threshold=170):
        self.next_id = 0
        self.objects = {}  # Stores object ID and its centroid
        self.distance_threshold = distance_threshold  # Threshold for considering object as matched

    def update(self, boxes):
        # Update the tracked detections

        for box in boxes:
            # Calculate the centroid of the new detection
            x, y, w, h = box
            centroid = (int(x + w / 2), int(y + h / 2))

            avg_side = (w+h)/2

            # If there are no objects currently tracked, add this as a new object
            if not self.objects: 
                self.objects[self.next_id] = [centroid, 8]
                self.next_id += 1
                continue

            # Find the closest object to the current box
            distances = {obj_id: np.linalg.norm(np.array(obj_centroid) - np.array(centroid))
                        for obj_id, (obj_centroid, _) in self.objects.items()}
            
            closest_obj_id, closest_distance = min(distances.items(), key=lambda x: x[1])

            # Check if the new detection matches any existing tracked object
            if closest_distance < self.distance_threshold * (avg_side/50):
                self.objects[closest_obj_id] = [centroid, 8]


            # If the object does not match existing objects, consider it a new distinct object
            else:
                self.objects[self.next_id] = [centroid, 8]
                self.next_id += 1

        updated_objects = {}

        for key in self.objects:
            self.objects[key][1] -= 1
            if self.objects[key][1] > 0:
                updated_objects[key] = self.objects[key]
        
        self.objects = updated_objects
        
        return
        

    def get_total_count(self):
        # Return the total number of distinct objects detected throughout the video
        return self.next_id

