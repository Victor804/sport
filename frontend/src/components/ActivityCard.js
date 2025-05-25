import React from 'react';
import {Card, CardActionArea, CardContent, Grid, Typography} from '@mui/material';
import {
  calculatePace,
  formatDistance,
  formatISODurationToHM,
  formatDateToReadable,
  formatISODurationToMin
} from "../utils/metrics";


export default function ActivityCard({start_time, duration, distance, sport_name}) {
    return (
        <Card sx={{maxWidth: 616, marginBottom: 2}}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="body2" color='text.secondary'>
                        {formatDateToReadable(start_time)}
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                        {sport_name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                                Distance
                            </Typography>
                            <Typography variant="h6">{formatDistance(sport_name, distance)}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                                Pace
                            </Typography>
                            <Typography
                                variant="h6">{calculatePace(sport_name, formatISODurationToMin(duration) , distance)}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                                Duration
                            </Typography>
                            <Typography variant="h6">{formatISODurationToHM(duration)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
