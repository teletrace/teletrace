import format from "date-fns/format";

export const formatDate = (date: number) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const formatDateToTimeString = (date: number) =>
  format(date, "PP, HH:mm:ss");
