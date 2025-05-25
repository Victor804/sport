import React from "react";
import Container from '@mui/material/Container';

import ActivityCard from "./components/ActivityCard";
import Graph from "./components/Graph"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            graph: {
                labels: [],
                values: []
            }
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

        let graph = <Graph labels={this.state.graph.labels}
                                values={this.state.graph.values}
                                color={'#FFA500'}
                            />

        return (
            <React.Fragment>
                <Container maxWidth="sm">
                    {graph}
                    {activities}
                </Container>
            </React.Fragment>

        )
    }
}