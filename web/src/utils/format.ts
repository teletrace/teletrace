import format from "date-fns/format";

export const formatDateAsDateTime = (
  date: Date | number,
  { showMs = false } = {}
) => {
  const pattern = showMs ? "PP, HH:mm:ss.SSS" : "PP, HH:mm:ss";
  return format(date, pattern);
};

export const formatNumber = (n: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const nanoSecToMs = (nanoSec: number) => {
  return nanoSec / (1000 * 1000);
};

export const roundNanoToTwoDecimalMs = (nanoSec: number) => {
  const ms = nanoSecToMs(nanoSec);
  return Math.round(ms * 100) / 100;
};

export const formatNanoAsMsDateTime = (nanoSec: number) => {
  const ms = nanoSecToMs(nanoSec);
  return formatDateAsDateTime(ms, { showMs: true });
};
