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
        }
    }

    async componentDidMount() {
        await Promise.all([
            this.fetchActivities(),
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


    

    render() {
        let activities = this.state.activities.map(item => (
            <ActivityCard key={item.id}
                          start_time={item.start_time}
                          duration={item.duration}
                          distance={item.distance}
                          sport_name={item.sport_name}
            />
        ));

        return (
            <React.Fragment>
                <Stack direction="row" spacing={0.5}>
                    <Container maxWidth="sm"><WeeklyDistanceGraph/></Container>

                    <Container maxWidth="sm">{activities}</Container>
                </Stack>
            </React.Fragment>

        )
    }
}