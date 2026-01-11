from collections import defaultdict
from backend.storage.db import connect

def total_time_per_app():
    with connect() as db:
        rows = db.execute("SELECT app, duration FROM usage").fetchall()

    stats = defaultdict(float)
    for app, duration in rows:
        stats[app] += duration

    return sorted(stats.items(), key=lambda x: x[1], reverse=True)