import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(count: number) {
  if (count < 1000) {
    return count;
  } else if (count < 1_000_000) {
    return `${Number((count / 1000).toFixed(1))}K`;
  } else {
    return `${Number((count / 1_000_000).toFixed(1))}M`;
  }
}
export function cleanUrl(url?: string) {
  if (!url) return "";
  if (url.slice(-1) === ".") {
    return url.slice(0, -1);
  }
  return url;
}

export function truncateText(text: string, size?: number) {
  let length = size ?? 5;
  return text.slice(0, length) + "..." + text.slice(-length);
}
export function getNameToShow(user: {
  npub: string;
  profile?: {
    displayName?: string;
    name?: string;
  };
}) {
  return (
    user.profile?.displayName ?? user.profile?.name ?? truncateText(user.npub)
  );
}
export function getTwoLetters(user: {
  npub: string;
  profile?: {
    displayName?: string;
    name?: string;
  };
}) {
  if (user.profile) {
    if (user.profile.displayName) {
      const firstLetter = user.profile.displayName.at(0);
      const secondLetter =
        user.profile.displayName.split(" ")[1]?.at(0) ??
        user.profile.displayName.at(1) ??
        "";
      return firstLetter + secondLetter;
    }
    if (user.profile.name) {
      const firstLetter = user.profile.name.at(0);
      const secondLetter =
        user.profile.name.split(" ")[1]?.at(0) ?? user.profile.name.at(1) ?? "";
      return firstLetter + secondLetter;
    }
  }
  return (user.npub.at(5) ?? "") + (user.npub.at(6) ?? "");
}

export function removeDuplicates<T>(data: T[], key?: keyof T) {
  if (key) {
    const unique = data.filter((obj, index) => {
      return index === data.findIndex((o) => obj[key] === o[key]);
    });
    return unique;
  } else {
    return data.filter((obj, index) => {
      return index === data.findIndex((o) => obj === o);
    });
  }
}

export async function copyText(text: string) {
  return await navigator.clipboard.writeText(text);
}
export function formatNumber(number: number) {
  if (typeof number === "number") {
    return number.toLocaleString("en-US");
  } else return "not a number";
}
export function log(
  isOn: boolean | undefined,
  type: "info" | "error" | "warn",
  ...args: unknown[]
) {
  if (!isOn) return;
  console[type](...args);
}

export function validateUrl(value: string) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}
export function btcToSats(amount: number) {
  return parseInt((amount * 100_000_000).toFixed());
}
