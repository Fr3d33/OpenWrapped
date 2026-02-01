import time
import sys
import os
from datetime import datetime

print("=" * 50)
print("OpenWrapped Tracker starting...")
print("=" * 50)

if getattr(sys, 'frozen', False):
    backend_path = os.path.dirname(sys.executable)
    sys.path.insert(0, backend_path)
    print(f"Running as EXE from: {backend_path}")

try:
    print("Loading modules...")
    try:
        from backend.collector.windows import get_active_app
        from backend.storage.db import init_db, insert_usage
        print("Modules loaded (backend.*)")
    except ImportError as e:
        print(f"  backend.* import failed: {e}")
        print("  Trying relative imports...")
        from collector.windows import get_active_app
        from storage.db import init_db, insert_usage
        print("Modules loaded (relative)")
    
    print("Initializing database...")
    init_db()
    print("Database initialized")
    
    print("\n" + "=" * 50)
    print("Tracker started successfully!")
    print("Monitoring your application usage...")
    print("Press Ctrl+C to stop")
    print("=" * 50 + "\n")
    
    current_app = None
    start_time = None
    CHECK_INTERVAL = 1
    
    while True:
        try:
            active_app = get_active_app()
            
            if active_app != current_app:
                if current_app and start_time:
                    duration = time.time() - start_time
                    timestamp = datetime.now().isoformat()
                    insert_usage(current_app, duration, timestamp)
                    print(f"{current_app}: {duration:.1f}s")
                
                current_app = active_app
                start_time = time.time()
            
            time.sleep(CHECK_INTERVAL)
        except Exception as loop_error:
            print(f"Error in tracking loop: {loop_error}")
            time.sleep(CHECK_INTERVAL)
            
except KeyboardInterrupt:
    if current_app and start_time:
        duration = time.time() - start_time
        timestamp = datetime.now().isoformat()
        insert_usage(current_app, duration, timestamp)
        print(f"\n{current_app}: {duration:.1f}s")
    
    print("\nTracker stopped!")
    
except Exception as e:
    print("\n" + "=" * 50)
    print("ERROR STARTING TRACKER:")
    print("=" * 50)
    print(f"Error: {type(e).__name__}")
    print(f"Message: {str(e)}")
    print("\nTraceback:")
    import traceback
    traceback.print_exc()
    print("=" * 50)
    print("\nPress Enter to close...")
    input()
