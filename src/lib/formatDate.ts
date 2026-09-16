/**
 * Formats a date/time in the Amsterdam timezone with an explicit timezone label.
 *
 * Note: Intl.DateTimeFormat throws a RangeError when `dateStyle`/`timeStyle`
 * are combined with `timeZoneName`, so explicit field options are used here.
 */
export const formatAmsterdam = (date: Date | string | number): string => {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Amsterdam",
    timeZoneName: "short",
  }).formatToParts(value);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = get("day");
  const month = get("month");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const zone = get("timeZoneName");

  return `${day} ${month} ${year} at ${hour}:${minute} ${zone} (Amsterdam)`;
};
