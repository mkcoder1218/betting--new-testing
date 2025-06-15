import axios, { AxiosResponse } from "axios";
import { LOCAL_USER, SERVER_URI } from "./constants";
import { User } from "../features/slices/userSlice";
import { useEffect } from "react";
import { useAppSelector } from "../features/hooks";

const LOGIN_URL = "user/login";

// const localUser = localStorage.getItem(LOCAL_USER);
// const userData: User | null = localUser ? JSON.parse(localUser) : null;

const getUserData = async () => {
  const localUser = localStorage.getItem(LOCAL_USER);
  return localUser ? JSON.parse(localUser) : null;
};

const setUpAxiosInterceptors = () => {
  let userData: User | null = null;
  getUserData().then((data) => {
    userData = data;
    console.log("USERDATA_TOKEN", userData);
  });
  if (process.env.NODE_ENV === "development") {
    console.log("USERDATA_TOKEN", userData);
  }
  const axiosInstance = axios.create({
    baseURL: SERVER_URI,
  });

  axiosInstance.interceptors.request.use(
    (config: any) => {
      console.log("USERDATA_TOKEN", userData);
      if (userData && userData?.token) {
        const token = userData?.token;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};
const axiosInstance = setUpAxiosInterceptors();

export const handleLoginSuccess = () => {
  setUpAxiosInterceptors();
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    setUpAxiosInterceptors();
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

export const useAxiosInterceptors = () => {
  const userData = useAppSelector((state) => state.user);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (userData && userData.user && userData.user.token) {
          config.headers.Authorization = `Bearer ${userData.user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [userData]);
};

export default axiosInstance;
