import React from "react";
import Graph from "./Graph";
import {Container} from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const color = "#FFA500"

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales:{
    x: {
      grid: {
        display: false
      },
    },
    y: {
      grid: {
        display: false
      },
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
};

export default class WeeklyDistanceGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            graph: {
                "CYCLING":
                    {
                    labels:[],
                    values:[]
                    }
            },
            selectedSport: "CYCLING"
        }
    }

    async componentDidMount() {
        await Promise.all([
            this.fetchGraph(),
            ]);
    }

    fetchGraph = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/graph`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            console.log("Graph data from API:", data);
            this.setState({ graph: data });
        } catch (error) {
            console.error("Erreur lors du chargement des données du graphique :", error);
        }
    };

    render() {
        let selectedData = this.state.graph[this.state.selectedSport];

        let graph = <Graph labels={selectedData.labels} values={selectedData.values} color={color} options={options}/>

        return(
            <Container>
                <select
                  value={this.state.selectedSport}
                  onChange={(e) => this.setState({ selectedSport: e.target.value })}
                  style={{ marginBottom: '1rem' }}>
                  {Object.keys(this.state.graph).map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
                {graph}
            </Container>)


    };
}