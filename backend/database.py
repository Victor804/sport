import sqlite3
import json
import glob


class Database:
    def __init__(self, database):
        self.connection = sqlite3.connect(database, check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()

    def create_tables(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS ActivityCard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time TEXT NOT NULL,
                duration TEXT NOT NULL,
                distance REAL NOT NULL,
                sport_name TEXT NOT NULL
            );
        """)

        self.cursor.execute("""
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
                FOREIGN KEY (activity_id) REFERENCES ActivityCard(id) ON DELETE CASCADE
            );
        """)

        self.cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_point_activity_id ON Point(activity_id);
        """)

        self.connection.commit()

    def add_activity(self, json_data):
        # Extraire les données
        start_time = json_data["startTime"]
        duration = json_data["duration"]
        distance = json_data["distance"]
        sport_name = json_data["exercises"][0]["sport"]

        self.cursor.execute("""
                            INSERT INTO ActivityCard (start_time, duration, distance, sport_name)
                            VALUES (?, ?, ?, ?);
                            """, (start_time, duration, distance, sport_name))

        activity_id = self.cursor.lastrowid

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
            self.cursor.execute("""
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


        self.connection.commit()

    def get_activities(self):
        self.cursor.execute("SELECT * FROM ActivityCard ORDER BY start_time ASC ;")
        return [dict(row) for row in self.cursor.fetchall()]

    def get_points(self, activity_id):
        self.cursor.execute("""
            SELECT * FROM Point
            WHERE activity_id = ?
            ORDER BY time;
        """, (activity_id,))
        return [dict(row) for row in self.cursor.fetchall()]

    def clear_tables(self):
        self.cursor.execute("DELETE FROM ActivityCard;")
        self.cursor.execute("DELETE FROM Point;")

        self.connection.commit()


def load_data(database):
    filenames = sorted(glob.glob("training_data/*.json"))
    for filename in filenames:
        with open(filename) as f:
            json_data = json.load(f)
            database.add_activity(json_data)


if __name__ == "__main__":
    database = Database("data.db")

    database.create_tables()
