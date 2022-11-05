import format from "date-fns/format";

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const formatDate = (date: number) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const formatDateToTimeString = (date: number) =>
  new Date(date).toLocaleTimeString("en-US", dateTimeFormatOptions);
