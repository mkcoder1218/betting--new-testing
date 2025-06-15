import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LOCAL_USER } from "../../config/constants";
import axiosInstance, { handleLoginSuccess } from "../../config/interceptor";
import { AxiosError } from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface AxiosResponseWrapper<T> {
  data: T;
  message: string;
  error: any;
}

export interface User {
  id: string;
  username: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  Agent: null | any;
  Cashier: Cashier;
  token: string;
}

export interface Cashier {
  id: string;
  shopId: string;
  active: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TokenPayload {
  id: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  Agent: null | any; // Assuming Agent can be null or some other type if not null
  Cashier: Cashier;
  iat: number;
  exp: number;
}

export interface Data {
  user: User;
  token: string;
}

interface AuthResponse {
  data: Data;
  message: string;
  error: any;
}

interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
  message: string | null;
}

let initialState: UserState = {
  loading: false,
  error: null,
  message: "",
  user: localStorage.getItem(LOCAL_USER)
    ? JSON.parse(localStorage.getItem(LOCAL_USER)!)
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.loading = action.payload.loading;
      state.user = action.payload.user;

      localStorage.setItem(LOCAL_USER, JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem(LOCAL_USER);
      window.location.href = "/";
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;

export const authUser =
  (username: string, password: string, navigate: NavigateFunction) =>
  async (
    dispatch: (arg0: { payload: UserState; type: "user/loginUser" }) => void
  ) => {
    dispatch(loginUser({ message: "", error: "", loading: true, user: null }));

    try {
      const loginResponse: AxiosResponseWrapper<AuthResponse> =
        await axiosInstance.post("user/login", { username, password });
      dispatch(
        loginUser({ message: "", error: "", loading: false, user: null })
      );
      
      if (loginResponse.data.message === "login successful") {
        localStorage.setItem(
          LOCAL_USER,
          JSON.stringify(loginResponse.data.data.user)
        );
        dispatch(
          loginUser({
            message: "",
            error: "",
            loading: true,
            user: loginResponse.data.data.user,
          })
          
        );
        console.log("loginResponse.data", loginResponse.data);
        handleLoginSuccess();
        // window.location.href = "/home"
      } else {
        dispatch(
          loginUser({
            message: loginResponse.error,
            error: loginResponse.error,
            loading: true,
            user: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        loginUser({
          message: "",
          error: err?.response?.data
            ? err.response.data.error
            : "Something went wrong",
          loading: false,
          user: null,
        })
      );
    }
  };
