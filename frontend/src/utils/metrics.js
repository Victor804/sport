import { DateTime, Duration } from "luxon";


export function calculatePace(sport: string, durationMinutes: number, distanceMeters: number): string {
    switch (sport) {
        case "RUNNING":
        case "CYCLING":
            return calculateSpeedPace(sport, durationMinutes, distanceMeters / 1000);

        case "POOL_SWIMMING":
            return calculateSwimmingPace(durationMinutes, distanceMeters);

        default:
            return calculateSpeedPace("RUNNING", durationMinutes, distanceMeters / 1000);
    }
}

function calculateSpeedPace(sport: string, durationMinutes: number, distanceKm: number): string {
    if (sport === "RUNNING") {
        const pace = durationMinutes / distanceKm;
        const minutes = Math.floor(pace);
        const seconds = Math.round((pace - minutes) * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
    }

    if (sport === "CYCLING") {
        const speed = Math.round(distanceKm / (durationMinutes / 60) * 10) / 10;
        return `${speed} km/h`;
    }

    return "";
}

function calculateSwimmingPace(durationMinutes: number, distanceMeters: number): string {
    const pacePer100m = durationMinutes / (distanceMeters / 100);
    const minutes = Math.floor(pacePer100m);
    const seconds = Math.round((pacePer100m - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /100m`;
}

export function formatDistance(sport: string, distanceMeters: number): string {
    switch (sport) {
        case "POOL_SWIMMING":
            return `${Math.round(distanceMeters)} m`;
        case "RUNNING":
        case "CYCLING":
        default:
            return `${Math.round(distanceMeters / 10) / 100} km`;
    }
}

export function formatISODurationToMin(isoDuration: string): number {
    return Duration.fromISO(isoDuration).as("minutes");
}

export function getElapsedMinutes(start: string, end: string): number {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    return  (endDate - startDate) / 60000;
}

export function formatISODurationToHM(isoDuration: string): string {
    const duration = Duration.fromISO(isoDuration);
    const hours = Math.floor(duration.as("hours"));
    const minutes = Math.floor(duration.minus({ hours }).as("minutes"));

    return `${hours} h ${minutes} min`;
}

export function formatMinToLabelTime(duration: number): string {
  const totalSeconds = Math.floor(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function formatDateToReadable(dateString: string): string {
    const date = DateTime.fromISO(dateString);
    return date.toFormat("MMM d, yyyy 'at' HH'h' mm");
}
