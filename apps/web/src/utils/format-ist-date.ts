const DEFAULT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
} satisfies Intl.DateTimeFormatOptions;

/**
 * Formats a datetime string that is stored in IST on the server
 * but incorrectly returned with a "Z" (UTC) suffix.
 *
 * Stripping the "Z" before parsing prevents JS from treating it
 * as UTC and shifting the time by +5:30.
 */
export function formatISTDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS
): string {
  // Remove trailing Z so the browser does not offset from UTC → IST
  const normalised = dateStr.endsWith("Z") ? dateStr.slice(0, -1) : dateStr;

  const d = new Date(normalised);

  if (Number.isNaN(d.getTime())) {
    return dateStr;
  }

  return d.toLocaleString("en-IN", options);
}
