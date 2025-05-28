import sqlite3
import json
import glob
from collections import defaultdict
from datetime import datetime

def truncate_to_secondes(ts):
    dt = datetime.fromisoformat(ts)
    return dt.replace(microsecond=0).isoformat()

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
                    sport_name TEXT NOT NULL,
                    avgHeartRate INTEGER,
                    maxHeartRate INTEGER,
                    avgSpeed REAL,
                    maxSpeed REAL,
                    ascent REAL,
                    descent REAL,
                    maxAltitude REAL
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
        start_time = json_data["startTime"]
        duration = json_data["duration"]
        distance = json_data["distance"]
        sport_name = json_data["exercises"][0]["sport"]
        avgHeartRate = json_data["exercises"][0].get("heartRate", {}).get("avg")
        maxHeartRate = json_data["exercises"][0].get("heartRate", {}).get("max")
        avgSpeed = json_data["exercises"][0].get("speed", {}).get("avg")
        maxSpeed = json_data["exercises"][0].get("speed", {}).get("max")

        ascent = json_data["exercises"][0].get("ascent")
        descent = json_data["exercises"][0].get("descent")
        maxAltitude = json_data["exercises"][0].get("altitude", {}).get("max")

        with self.get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute("""
                                INSERT INTO Activity (start_time, 
                                                      duration, 
                                                      distance, 
                                                      sport_name,
                                                      avgHeartRate,
                                                      maxHeartRate,
                                                      avgSpeed,
                                                      maxSpeed,
                                                      ascent,
                                                      descent,
                                                      maxAltitude)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                                """, (start_time, duration, distance, sport_name, avgHeartRate, maxHeartRate,
                                                 avgSpeed, maxSpeed, ascent, descent,maxAltitude))

            activity_id = cursor.lastrowid

            samples = json_data["exercises"][0]["samples"]
            points_by_time = {}

            def insert_sample(type_, sample):
                ts = truncate_to_secondes(sample["dateTime"])
                if ts not in points_by_time:
                    points_by_time[ts] = {}
                points_by_time[ts][type_] = sample.get("value")

            for type_ in ["altitude", "heartRate", "speed", "distance"]:
                for sample in samples.get(type_, []):
                    insert_sample(type_, sample)

            for route in samples.get("recordedRoute", []):
                ts = truncate_to_secondes(route["dateTime"])
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

    def get_activity(self, activity_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Activity WHERE id = ? ;", (activity_id,))

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
        #TODO: Select only the last 6 weeks
        sport_mapping = {
            "ROAD_RUNNING": "RUNNING",
        }

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                           SELECT strftime('%Y-%W', substr(start_time, 1, 10)) AS week,
                                  SUM(distance) / 1000                         AS total_distance,
                                  sport_name
                           FROM Activity
                           GROUP BY sport_name, week
                           ORDER BY week ASC, sport_name ASC;
                           """)

            rows = cursor.fetchall()

        all_weeks = sorted({row[0] for row in rows})

        aggregated = defaultdict(lambda: defaultdict(float))

        for week, distance, sport in rows:
            grouped_sport = sport_mapping.get(sport, sport)
            aggregated[grouped_sport][week] += distance

        result = {}
        for sport_group, data_by_week in aggregated.items():
            result[sport_group] = {
                "labels": all_weeks,
                "values": [data_by_week.get(week, 0) for week in all_weeks]
            }

        return result

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
            print(filename)
            database.add_activity(json_data)


if __name__ == "__main__":
    database = Database("data.db")

    database.create_tables()
    load_data(database)