export function formatFutureTime(isoTimestamp: string): string {
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  const unixTimestamp = Math.floor(new Date(isoTimestamp).getTime() / 1000); // Convert ISO format to Unix timestamp
  const elapsedTime = unixTimestamp - currentTime; // Calculate the future time difference

  if (elapsedTime <= 0) {
    return "Expired";
  }

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const year = 365 * day; // Assuming a non-leap year for simplicity

  if (elapsedTime < minute) {
    return "Expires soon";
  } else if (elapsedTime < hour) {
    const minutes = Math.floor(elapsedTime / minute);
    return `Expires in ${minutes}m`;
  } else if (elapsedTime < day) {
    const hours = Math.floor(elapsedTime / hour);
    return `Expires in ${hours}h`;
  } else if (elapsedTime < week) {
    const days = Math.floor(elapsedTime / day);
    return `Expires in ${days}d`;
  } else if (elapsedTime < year) {
    const weeks = Math.floor(elapsedTime / week);
    return `Expires in ${weeks}w`;
  } else {
    const years = Math.floor(elapsedTime / year);
    return `Expires in ${years}y`;
  }
}
