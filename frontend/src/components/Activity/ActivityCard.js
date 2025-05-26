import React from 'react';
import {Link} from 'react-router-dom'
import {Card, CardActionArea, CardContent, Grid, Skeleton, Typography} from '@mui/material';
import {
  calculatePace,
  formatDistance,
  formatISODurationToHM,
  formatDateToReadable,
  formatISODurationToMin
} from "../../utils/metrics";

export function SkeletonActivityCard() {
  return (
    <Card sx={{ maxWidth: 616, marginBottom: 2 }}>
      <CardContent>
        <Skeleton width="30%" height={20} />
        <Skeleton width="50%" height={30} sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item key={i}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={80} height={30} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export function ActivityCard({id, start_time, duration, distance, sport_name}) {
    return (
        <Card sx={{maxWidth: 616, marginBottom: 2}}>
            <CardActionArea component={Link} to={`/activity/${id}`}>
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
