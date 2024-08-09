import axios, { AxiosResponse } from "axios";
import { LOCAL_USER, SERVER_URI } from "./constants";
import { User } from "../features/slices/userSlice";

const LOGIN_URL = "user/login";

const localUser = localStorage.getItem(LOCAL_USER);
const userData: User | null = localUser ? JSON.parse(localUser) : null;

const axiosInstance = axios.create({
  baseURL: SERVER_URI,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (userData?.token && config.url !== LOGIN_URL) {
      const token = userData?.token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.href !== "/"
    ) {
      // window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
