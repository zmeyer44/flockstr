import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export function relativeTimeUnix(timestamp: number) {
  const config = {
    thresholds: [
      { l: "s", r: 1 },
      { l: "m", r: 1 },
      { l: "mm", r: 59, d: "minute" },
      { l: "h", r: 1 },
      { l: "hh", r: 23, d: "hour" },
      { l: "d", r: 1 },
      { l: "dd", r: 364, d: "day" },
      { l: "y", r: 1 },
      { l: "yy", d: "year" },
    ],
    rounding: Math.floor,
  };
  dayjs.extend(updateLocale);

  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "%s seconds",
      m: "1 min",
      mm: "%d mins",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      y: "1 year",
      yy: "%d years",
    },
  });
  dayjs.extend(relative, config);
  return dayjs(timestamp * 1000).fromNow();
}
export function relativeTime(timestamp: Date) {
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "now",
      s: "now",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });
  dayjs.extend(relative);
  return dayjs(timestamp).fromNow();
}
export function daysOffset(targetDate: Date) {
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  // Convert the time difference to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}
export function formatDate(timestamp: Date, format?: string) {
  dayjs.extend(advancedFormat);
  dayjs.extend(timezone);
  return dayjs(timestamp).format(format ?? "MMMM Do, YYYY");
}
export function formatDateUnix(timestamp: number, format?: string) {
  dayjs.extend(advancedFormat);
  dayjs.extend(timezone);
  return dayjs(timestamp * 1000).format(format ?? "MMMM Do, YYYY");
}
export function convertToTimezoneDate(inputDate: Date, _timezone: string) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log("time", _timezone);
  return dayjs(inputDate).tz(_timezone).toDate();
}

export function fromUnix(unix: number) {
  return new Date(unix * 1000);
}
export function addMinutesToDate(inputDate: Date, minutesToAdd: number) {
  if (!(inputDate instanceof Date)) {
    throw new Error("Invalid date input");
  }

  if (typeof minutesToAdd !== "number" || isNaN(minutesToAdd)) {
    throw new Error("Invalid minutes input");
  }
  // Copy the input date to avoid modifying the original date
  const resultDate = new Date(inputDate);

  // Add the specified number of minutes
  resultDate.setMinutes(resultDate.getMinutes() + minutesToAdd);

  return resultDate;
}

export function toUnix(inputDate: Date) {
  return dayjs(inputDate).unix();
}

export function convertToTimezone(inputDate: Date, targetTimezone: string) {
  if (!(inputDate instanceof Date)) {
    throw new Error("Invalid date input");
  }

  if (typeof targetTimezone !== "string") {
    throw new Error("Invalid timezone input");
  }
  dayjs.extend(utc);
  dayjs.extend(timezone);
  let hours = inputDate.getHours().toString();

  if (hours.length === 1) {
    hours = "0" + hours;
  }
  let minutes = inputDate.getMinutes().toString();
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  let day = inputDate.getDate().toString();
  if (day.length === 1) {
    day = "0" + day;
  }
  let month = (inputDate.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }

  const dateString = `${inputDate.getFullYear()}-${month}-${day}T${hours}:${minutes}:00.000Z`;
  // Get plain date w/o timezones
  const initialDate = new Date(dateString);

  const plainString = initialDate.toISOString().split(".")[0] as string;

  const plain = dayjs.tz(plainString, targetTimezone);
  return plain.toDate();
}
