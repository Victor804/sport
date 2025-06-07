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

@app.route('/activity/<activity_id>')
def activity(activity_id):
    return jsonify(db.get_activity(activity_id))

@app.route('/activity/points/<activity_id>')
def activity_points(activity_id):
    return jsonify(db.get_points(activity_id))

@app.route('/calendar/<year>')
def calendar(year):
    return jsonify(db.get_calendar(year))


if __name__ == '__main__':
    app.run(debug=True)