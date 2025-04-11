from flask import Flask, jsonify
from flask_cors import CORS
import data

app = Flask(__name__)
CORS(app)
DATA = data.load_data()


@app.route('/activities')
def activities():
    return jsonify(data.dashboard_data(DATA))

if __name__ == '__main__':
    app.run(debug=True)
