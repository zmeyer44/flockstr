import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";

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
