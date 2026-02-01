import sqlite3
import os
from pathlib import Path

DB_DIR = Path.home() / "AppData" / "Local" / "OpenWrapped"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / 'openwrapped.db'

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