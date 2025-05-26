import React, { useState, useEffect } from "react";
import { ActivityCard , SkeletonActivityCard } from "./ActivityCard";
import { Container } from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activities`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Erreur lors du chargement des activités :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Container>
      {loading
        ? Array.from({ length: 10 }).map((_, i) => <SkeletonActivityCard key={i} />)
        : activities.map(item => (
            <ActivityCard
              key={item.id}
              id={item.id}
              start_time={item.start_time}
              duration={item.duration}
              distance={item.distance}
              sport_name={item.sport_name}
            />
          ))}
    </Container>
  );
}
