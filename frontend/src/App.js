import React from "react";
import Container from '@mui/material/Container';

import Activity from "./Activity";

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
            const response = await fetch("http://127.0.0.1:5000/activities");
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            this.setState({ activities: data });
        } catch (error) {
            console.error("Erreur lors du chargement des activités :", error);
        }
    };
    

    render(){
        let activities = this.state.activities.map(item => (
            <Activity key={item} date={item.datetime} type={item.type} distance={item.distance} time={item.time} />
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