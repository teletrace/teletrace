import axios from "axios";

import { API_URL } from "@/config";

export const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);
