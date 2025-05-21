from flask import Flask, jsonify
from flask_cors import CORS
import database

app = Flask(__name__)
CORS(app)

db = database.Database("data.db")

@app.route('/activities')
def activities():
    return jsonify(db.get_activities())

if __name__ == '__main__':
    app.run(debug=True)