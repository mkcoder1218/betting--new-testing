import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/home",
        element: <App />
    }
])