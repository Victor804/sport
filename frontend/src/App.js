import React from "react";
import {Container, Stack} from '@mui/material';

import WeeklyDistanceGraph from "./components/Graph/WeeklyDistanceGraph"
import ActivitiesList from "./components/Activity/ActivitiesList";
import CalendarHeatmap from "./components/Calendar/CalendarHeatmap"


export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CalendarHeatmap year={2025}/>
                <CalendarHeatmap year={2024}/>
                <CalendarHeatmap year={2023}/>
                <Stack direction="row" spacing={0.5}>
                    <Container maxWidth="sm">
                        <WeeklyDistanceGraph/>
                    </Container>
                    <Container maxWidth="sm">
                        <ActivitiesList/>
                    </Container>
                </Stack>
            </React.Fragment>

        )
    }
}