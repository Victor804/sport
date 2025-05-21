import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardActionArea, Typography, Grid, CardMedia } from '@mui/material';
import { Duration, DateTime } from 'luxon';

function calculatePace(sport_name, durationMinutes, distanceInMeter){
    switch(sport_name) {
        case "RUNNING":
            return calculateRunningPace(durationMinutes, distanceInMeter/1000);

        case "POOL_SWIMMING":
            return calculateSwimmingPace(durationMinutes, distanceInMeter);

        case "CYCLING":
            return calculateCyclingPace(durationMinutes, distanceInMeter/1000);
    
        default:
            return calculateRunningPace(durationMinutes, distanceInMeter/1000);
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


function formatDistance(sport_name, distanceInMeter){
    switch(sport_name) {
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
    const start_time = DateTime.fromISO(dateString);
  
    const formattedDate = start_time.toFormat("MMM d, yyyy 'at' HH'h' mm");
    return formattedDate;
  }

export default function Activity({id, start_time, duration, distance, sport_name })  {
        return (
            <Card sx={{ maxWidth: 616, marginBottom: 2 }}>
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
                            <Typography variant="h6">{calculatePace(sport_name, Duration.fromISO(duration).as("minutes"), distance)}</Typography>
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
