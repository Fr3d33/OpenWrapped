import sys
import os

if getattr(sys, 'frozen', False):
    backend_path = os.path.dirname(sys.executable)
    sys.path.insert(0, backend_path)

from flask import Flask, jsonify
from flask_cors import CORS

try:
    from backend.analytics.aggregate import total_time_per_app
    from backend.storage.db import init_db
except ImportError:
    from analytics.aggregate import total_time_per_app
    from storage.db import init_db

app = Flask(__name__)
CORS(app)

init_db()

@app.route("/stats", methods=["GET"])
def stats():
    data = total_time_per_app()
    print(f"Sending {len(data)} stats to frontend")
    return jsonify(data)

if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    app.run(host='127.0.0.1', port=8000, debug=False)