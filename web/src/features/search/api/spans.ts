import { API_URL } from "@/config";
import { InternalSpan } from "@/features/search/types/InternalSpan";

export const fetchSpans = async (amt: number, start: string, key: string) => {
  const response = await fetch(
    `${API_URL}/span?amt=${amt}&start=${start}&key=${key}`
  );
  return response.json() as Promise<InternalSpan[]>;
};
