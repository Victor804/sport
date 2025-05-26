import React from "react";
import {Container, Stack} from '@mui/material';

import ActivityCard from "./components/ActivityCard";
import WeeklyDistanceGraph from "./components/Graph/WeeklyDistanceGraph"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            graph: {
                "CYCLING":
                    {
                    labels:[1, 2, 3],
                    values:[1, 2, 3]
                    }
            },
            selectedSport: "CYCLING"
        }
    }

    async componentDidMount() {
        await Promise.all([
            this.fetchActivities(),
            this.fetchGraph()
            ]);
    }

    fetchActivities = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/activities`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            this.setState({activities: data});
        } catch (error) {
            console.error("Erreur lors du chargement des activités :", error);
        }
    };

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
        let activities = this.state.activities.map(item => (
            <ActivityCard key={item.id}
                          start_time={item.start_time}
                          duration={item.duration}
                          distance={item.distance}
                          sport_name={item.sport_name}
            />
        ));

        let selectedData = this.state.graph[this.state.selectedSport];
        console.log(selectedData)

        let graph = <WeeklyDistanceGraph labels={selectedData.labels} values={selectedData.values}/>


        return (
            <React.Fragment>
                <Stack direction="row" spacing={0.5}>
                    <Container maxWidth="sm">
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
                    </Container>

                    <Container maxWidth="sm">{activities}</Container>
                </Stack>
            </React.Fragment>

        )
    }
}