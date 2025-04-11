import React from 'react';
import { Card, CardContent, CardMedia, CardActionArea, Typography, Grid } from '@mui/material';
import { Duration, DateTime } from 'luxon';

function calculatePace(type, durationMinutes, distanceInMeter){
    console.log("tpye" + type)
    switch(type) {
        case "RUNNING":
            return calculateRunningPace(durationMinutes, distanceInMeter/1000);

        case "POOL_SWIMMING":
            return calculateSwimmingPace(durationMinutes, distanceInMeter);

        case "CYCLING":
            return calculateCyclingPace(durationMinutes, distanceInMeter/1000);
    
        default:
            return calculateRunningPace(durationMinutes, distanceInMeter);
    }
}

function calculateRunningPace(durationMinutes, distanceKm) {
    const pace = durationMinutes / distanceKm;
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    const paddedSeconds = seconds.toString().padStart(2, '0');
  
    return `${minutes}:${paddedSeconds} /km`;
}


function calculateCyclingPace(durationMinutes, distanceKm) {
    const pace = Math.round(distanceKm / (durationMinutes / 60) * 10) / 10;
  
    return `${pace} km/h`;
}


function calculateSwimmingPace(durationMinutes, distanceInMeter) {
    const pace = durationMinutes / (distanceInMeter/100);
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    const paddedSeconds = seconds.toString().padStart(2, '0');
  
    return `${minutes}:${paddedSeconds} /100m`;
}


function formatDistance(type, distanceInMeter){
    switch(type) {
        case "RUNNING":
            return `${Math.round(distanceInMeter / 10) / 100} km`;

        case "POOL_SWIMMING":
            return `${Math.round(distanceInMeter)} m`;

        case "CYCLING":
            return `${Math.round(distanceInMeter / 10) / 100} km`;
    
        default:
            return `${Math.round(distanceInMeter / 10) / 100} km`;
    }
}


function formatISODurationToHM(isoDuration) {
  const duration = Duration.fromISO(isoDuration);

  const hours = Math.floor(duration.as("hours"));
  const minutes = Math.floor(duration.minus({ hours }).as("minutes"));

  return `${hours} h ${minutes} min`;
}

function formatDateToReadable(dateString) {
    const date = DateTime.fromISO(dateString);
  
    const formattedDate = date.toFormat("MMM d, yyyy 'at' HH'h' mm");
    return formattedDate;
  }

export default function Activity({date, type, distance, time})  {
        return (
            <Card sx={{ maxWidth: 616, marginBottom: 2 }}>
                <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="body2" color='text.secondary'>
                        {formatDateToReadable(date)}
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                        {type}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                            Distance
                            </Typography>
                            <Typography variant="h6">{formatDistance(type, distance)}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                            Pace
                            </Typography>
                            <Typography variant="h6">{calculatePace(type, Duration.fromISO(time).as("minutes"), distance)}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2" color="text.secondary">
                            Time
                            </Typography>
                            <Typography variant="h6">{formatISODurationToHM(time)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
            </Card>
        );
}
