// Utility functions for parsing API responses

/**
 * Parse ISO-8601 duration string (e.g., "PT3M20S") to milliseconds
 * @param duration ISO-8601 duration string
 * @returns duration in milliseconds
 */
export function parseDuration(duration: string): number {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
  if (!matches) return 0;
  
  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseFloat(matches[3] || "0");
  
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Format milliseconds to ISO-8601 duration string
 * @param ms duration in milliseconds
 * @returns ISO-8601 duration string (e.g., "PT3M20S")
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = "PT";
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (secs > 0 || result === "PT") result += `${secs}S`;
  
  return result;
}

/**
 * Parse ISO date string to Date object
 * @param dateString ISO date string
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format Date object to ISO string for API
 * @param date Date object
 * @returns ISO date string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}
