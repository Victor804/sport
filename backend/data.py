import json
import glob


def load_data():
    training_data = []
    for filename in glob.glob("data/*.json"):
        with open(filename) as f:
            d = json.load(f)
            training_data.append(d)
            
    return training_data        
            

def dashboard_data(training_data):
    dashboard_data = []
    for data in training_data:
        dashboard_data.append({"datetime":data["startTime"], "type":data["exercises"][0]["sport"], "distance":data["distance"], "time":data["duration"]})
    
    return dashboard_data