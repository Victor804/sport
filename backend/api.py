from flask import Flask, jsonify
from flask_cors import CORS
import database

app = Flask(__name__)
CORS(app)

db = database.Database("data.db")

@app.route('/activities')
def activities():
    return jsonify(db.get_activities())

@app.route('/graph')
def graph():
    return jsonify(db.get_distance_by_week_sport())

if __name__ == '__main__':
    app.run(debug=True)