import sqlite3 

DB_PATH = 'openwrapped.db'

def connect():
    return sqlite3.connect(DB_PATH)

def init_db():
    with connect() as db:
        db.execute("""
        CREATE TABLE IF NOT EXISTS usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            app TEXT,
            duration REAL,
            timestamp TEXT
        )
        """)

def insert_usage(app, duration, timestamp):
    with connect() as db:
        db.execute(
            "INSERT INTO usage (app, duration, timestamp) VALUES (?, ?, ?)",
            (app, duration, timestamp)
        )