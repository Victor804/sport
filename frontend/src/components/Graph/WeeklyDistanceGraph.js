import React, { useEffect, useState } from "react";
import { Container, Skeleton, Box } from "@mui/material";
import { Line } from 'react-chartjs-2';
import { hexToRgba } from "../../utils/color";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const color = "#FFA500";

const getOptions = () => ({
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { display: false },
      ticks: {
        callback: function (value, index, ticks) {
          const firstIndex = 0;
          const lastIndex = ticks.length - 1;
          const middleIndex = Math.floor(lastIndex / 2);
          if (index === firstIndex || index === middleIndex || index === lastIndex) {
            return value;
          }
          return '';
        },
      },
    },
  },
});

export default function WeeklyDistanceGraph() {
  const [graph, setGraph] = useState({});
  const [selectedSport, setSelectedSport] = useState("CYCLING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/graph`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setGraph(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du graphique :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  const selectedData = graph[selectedSport] || { labels: [], values: [] };

  const data = {
    labels: selectedData.labels,
    datasets: [
      {
        data: selectedData.values,
        fill: true,
        borderColor: color,
        backgroundColor: hexToRgba(color, 0.2),
        tension: 0.3,
        pointBackgroundColor: color,
        pointRadius: 0,
      },
    ],
  };

  return (
    <Container>
      <select
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
        style={{ marginBottom: '1rem' }}
        disabled={loading}
      >
        {Object.keys(graph).map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>

      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Box>
      ) : (
        <Line data={data} options={getOptions()} />
      )}
    </Container>
  );
}
