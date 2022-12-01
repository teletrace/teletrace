// this file contains configuration for the application such as API_URL, etc.
const LOCAL_API_URL = "http://localhost:8080";
export const API_URL = process.env.REACT_APP_API_URL ?? LOCAL_API_URL;
