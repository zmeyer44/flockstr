export function unixTimeNowInSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
  return new Date(Date.now() + 3600 * 1000 * 24);
}

export function formattedDate(unixTimestampInSeconds: number): string {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  const date = new Date(unixTimestampInSeconds * 1000);
  return date.toLocaleDateString("en-US", options);
}
