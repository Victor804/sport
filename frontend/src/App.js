import React from "react";
import {Container, Stack} from '@mui/material';

import WeeklyDistanceGraph from "./components/Graph/WeeklyDistanceGraph"
import ActivitiesList from "./components/ActivitiesList";

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Stack direction="row" spacing={0.5}>
                    <Container maxWidth="sm"><WeeklyDistanceGraph/></Container>
                    <Container maxWidth="sm"><ActivitiesList/></Container>
                </Stack>
            </React.Fragment>

        )
    }
}