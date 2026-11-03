export function humanDate(isoString: string) {
  const date = new Date(isoString).toLocaleString('en-IN', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return date.replace(/\b(am|pm)\b/, (match) => match.toUpperCase())
}
