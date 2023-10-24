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
  return dayjs(timestamp).fromNow();
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
function timezoneDiff(ianatz: string) {
  const date = new Date();
  // suppose the date is 12:00 UTC
  var invdate = new Date(
    date.toLocaleString("en-US", {
      timeZone: ianatz,
    }),
  );

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  return diff;
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

  // Get plain date w/o timezones
  const initialDate = new Date(inputDate + "Z");
  const plainString = initialDate.toISOString().split(".")[0] as string;
  const plain = dayjs.tz(plainString, targetTimezone);
  return plain.toDate();
}
