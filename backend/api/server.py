from flask import Flask, jsonify
from flask_cors import CORS
from backend.analytics.aggregate import total_time_per_app

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/stats", methods=["GET"])
def stats():
    data = total_time_per_app()
    print(f"Sending {len(data)} stats to frontend")  # Debug output
    return jsonify(data)

if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    app.run(port=8000, debug=True)