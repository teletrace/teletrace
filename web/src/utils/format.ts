import format from "date-fns/format";

export const formatDate = (date: number) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss");
