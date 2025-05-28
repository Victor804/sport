import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  formatDateToReadable,
  formatISODurationToMin,
  formatMinToLabelTime,
  formatDistance,
  calculatePace,
  formatPace
} from "../../utils/metrics";


export default function ActivityHeader({ activityData }) {
  const data = activityData?.[0];
  if (!data) return null;

  return (
<Container sx={{ mt: 4 }}>
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        {data.sport_name}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        {formatDateToReadable(data.start_time) || "N/A"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Duration</Typography>
          <Typography>{formatMinToLabelTime(formatISODurationToMin(data.duration)) || "N/A"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Distance</Typography>
          <Typography>{formatDistance(data.sport_name, data.distance) || "N/A"}</Typography>
        </Grid>

        {/* Heart Rate Grouped */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Avg HR</Typography>
          <Typography>
            {data.avgHeartRate != null ? `${data.avgHeartRate} bpm` : "N/A"}
          </Typography>
          <Typography variant="caption" display="block">
            Max: {data.maxHeartRate != null ? `${data.maxHeartRate} bpm` : "N/A"}
          </Typography>
        </Grid>

        {/* Speed / Pace Grouped */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Avg Pace</Typography>
          <Typography>
            {formatPace(data.sport_name, data.avgSpeed) || "N/A"}
          </Typography>
          <Typography variant="caption" display="block">
            Max: {formatPace(data.sport_name, data.maxSpeed) || "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Ascent</Typography>
          <Typography>
            {data.ascent != null ? `${Math.round(data.ascent)} m` : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Descent</Typography>
          <Typography>
            {data.descent != null ? `${Math.round(data.descent)} m` : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2">Max Altitude</Typography>
          <Typography>
            {data.maxAltitude != null ? `${Math.round(data.maxAltitude)} m` : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Container>

  );
}
