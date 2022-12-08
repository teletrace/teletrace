import format from "date-fns/format";

export const formatDate = (date: number) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const formatDateToTimeString = (date: number) =>
  format(date, "PP, HH:mm:ss");

export const formatNumber = (n: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
