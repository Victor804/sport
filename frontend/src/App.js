import React from "react";
import Container from '@mui/material/Container';

import ActivityCard from "./components/ActivityCard";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activities: []
        }
    }

    async componentDidMount() {
        await this.fetchActivities();
    }

    fetchActivities = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/activities`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            this.setState({activities: data});
        } catch (error) {
            console.error("Erreur lors du chargement des activités :", error);
        }
    };


    render() {
        let activities = this.state.activities.map(item => (
            <ActivityCard key={item.id} id={item.id}
                          start_time={item.start_time}
                          duration={item.duration}
                          distance={item.distance}
                          sport_name={item.sport_name}
            />
        ));


        return (
            <React.Fragment>
                <Container maxWidth="sm">
                    {activities}
                </Container>
            </React.Fragment>

        )
    }
}