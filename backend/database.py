import sqlite3
import json
import glob


class Database:
    def __init__(self, db_path):
        self.db_path = db_path

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def create_tables(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Activity (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    start_time TEXT NOT NULL,
                    duration TEXT NOT NULL,
                    distance REAL NOT NULL,
                    sport_name TEXT NOT NULL
                );
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Point (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    activity_id INTEGER NOT NULL,
                    time TEXT NOT NULL,
                    altitude REAL,
                    heart_rate INTEGER,
                    speed REAL,
                    distance REAL,
                    latitude REAL,
                    longitude REAL,
                    UNIQUE (activity_id, time),
                    FOREIGN KEY (activity_id) REFERENCES Activity(id) ON DELETE CASCADE
                );
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_point_activity_id ON Point(activity_id);
            """)

            conn.commit()

    def add_activity(self, json_data):
        # Extraire les données
        start_time = json_data["startTime"]
        duration = json_data["duration"]
        distance = json_data["distance"]
        sport_name = json_data["exercises"][0]["sport"]

        with self.get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute("""
                                INSERT INTO Activity (start_time, duration, distance, sport_name)
                                VALUES (?, ?, ?, ?);
                                """, (start_time, duration, distance, sport_name))

            activity_id = cursor.lastrowid

            samples = json_data["exercises"][0]["samples"]
            points_by_time = {}

            def insert_sample(type_, sample):
                ts = sample["dateTime"]
                if ts not in points_by_time:
                    points_by_time[ts] = {}
                points_by_time[ts][type_] = sample.get("value")

            for type_ in ["altitude", "heartRate", "speed", "distance"]:
                for sample in samples.get(type_, []):
                    insert_sample(type_, sample)

            for route in samples.get("recordedRoute", []):
                ts = route["dateTime"]
                if ts not in points_by_time:
                    points_by_time[ts] = {}
                points_by_time[ts]["latitude"] = route.get("latitude")
                points_by_time[ts]["longitude"] = route.get("longitude")
                points_by_time[ts]["altitude"] = route.get("altitude")

            for ts, values in points_by_time.items():
                cursor.execute("""
                    INSERT OR IGNORE INTO Point (
                        activity_id, time, altitude, heart_rate,
                        speed, distance, latitude, longitude
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    activity_id,
                    ts,
                    values.get("altitude"),
                    values.get("heartRate"),
                    values.get("speed"),
                    values.get("distance"),
                    values.get("latitude"),
                    values.get("longitude")
                ))


            conn.commit()

    def get_activities(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Activity ORDER BY start_time DESC ;")

            return [dict(row) for row in cursor.fetchall()]

    def get_points(self, activity_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM Point
                WHERE activity_id = ?
                ORDER BY time;
            """, (activity_id,))

            return [dict(row) for row in cursor.fetchall()]

    def get_distance_by_week_sport(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""SELECT 
                                    strftime('%Y-%W', substr(start_time, 1, 10)) AS week,
                                    SUM(distance)/1000 AS total_distance
                                FROM Activity
                                GROUP BY week
                                ORDER BY week ASC, sport_name ASC;
            """)

            rows = cursor.fetchall()

        return {"labels": [row[0] for row in rows],
                "values": [row[1] for row in rows]}

    def clear_tables(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Activity;")
            cursor.execute("DELETE FROM Point;")

            conn.commit()


def load_data(database):
    filenames = sorted(glob.glob("training_data/*.json"))
    for filename in filenames:
        with open(filename) as f:
            json_data = json.load(f)
            database.add_activity(json_data)


if __name__ == "__main__":
    database = Database("data.db")

    database.create_tables()

    print(database.get_activities())