import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";
import AuthGuard from "../auth/AuthGuard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/index.html/home",
    element: <AuthGuard element={<App />} />,
  },
]);
