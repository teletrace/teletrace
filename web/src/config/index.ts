// this file contains configuration for the application such as API_URL, etc.
export const API_URL =
  (process.env.API_URL as string) || "http://localhost:8000";
