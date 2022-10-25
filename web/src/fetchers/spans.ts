import { InternalSpan } from "@/model/InternalSpan";

const HOST_AND_PORT = "http://localhost:5000"; // TODO: Change to real API, this is a local test server for now

export const fetchSpans = async (amt: number, start: string, key: string) => {
  const response = await fetch(
    `${HOST_AND_PORT}/span?amt=${amt}&start=${start}&key=${key}`
  );
  return response.json() as Promise<InternalSpan[]>;
};
