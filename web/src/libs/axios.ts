import axios from "axios";

import { API_URL } from "@/config";

export const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(message);

    return Promise.reject(error);
  }
);
