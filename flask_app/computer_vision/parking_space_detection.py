from roboflow import Roboflow
rf = Roboflow(api_key="fQz2N8jOYuLdgwhaC6Bs")
project = rf.workspace().project("parking-space-ipm1b")
model = project.version(4).model

#takes in a string, which is the image name
#returns the amount of parking spaces
def count_cars(image):
    # infer on a local image
    x = (model.predict(image, confidence=5, overlap=30).json())

    # visualize prediction
    model.predict(image, confidence=5, overlap=30).save("prediction.jpg")
    return(len(x['predictions']))