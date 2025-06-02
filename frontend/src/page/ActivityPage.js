import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MetricGraph from "../components/Graph/MetricGraph";
import { getElapsedMinutes } from "../utils/metrics";
import { downsampleLabels, downsample } from "../utils/downsampling";
import {Container, Stack} from '@mui/material';
import ActivityHeader from "../components/Activity/ActivityHeader";
import MapsActivity from "../components/Maps/MapsActivity";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export default function ActivityPage() {
  const { id } = useParams();

  const [activityData, setActivityData] = useState(null);
  const [pointData, setPointData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activity/${id}`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        setActivityData(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'activité :", error);
      }
    };

    const fetchGPSData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activity/points/${id}`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        setPointData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des points GPS :", error);
      }
    };

    fetchActivityData();
    fetchGPSData();
  }, [id]);

  useEffect(() => {
    if (activityData && pointData.length > 0 && !dataLoaded) {
      setDataLoaded(true);
    }
  }, [activityData, pointData, dataLoaded]);

  return (
      <Stack>
        { dataLoaded &&
            <ActivityHeader activityData={activityData}/>
        }
        <Container>
            {dataLoaded && (
                <MapsActivity
                    pointData={
                      pointData.map((point) => ({
                        latitude: point.latitude,
                        longitude: point.longitude
                      })
                    )}
                />
            )}
        </Container>

          <Container sx={{ height: 500 }}>
          <MetricGraph
              labels={downsampleLabels(pointData.map((point) =>
                getElapsedMinutes(activityData[0].start_time, point.time)
              ))}
              values={downsample(pointData.map((point) => point.speed))}
              values2={downsample(pointData.map((point) => point.heart_rate))}
              values3={downsample(pointData.map((point) => point.altitude))}
              color={"#1d91f5"}
            />
        </Container>
      </Stack>
  );
}
