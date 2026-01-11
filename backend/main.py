import time
from datetime import datetime
from backend.collector.windows import get_active_app
from backend.storage.db import init_db, insert_usage
from backend.analytics.aggregate import total_time_per_app


init_db()   

last_app = None
last_time = time.time()

while True:
    app = get_active_app()
    now = time.time()

    if last_app and app != last_app:
        duration = now - last_time
        insert_usage(last_app, duration, datetime.utcnow().isoformat())

        last_app = app
        last_time = now

    if not last_app:
        last_app = app
        last_time = now
    
    time.sleep(1)

print(total_time_per_app())
