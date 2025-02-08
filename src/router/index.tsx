import { createBrowserRouter } from "react-router-dom";
import App from "../views/App";
import Login from '../views/login'
import Register from '../views/register'
import Home from '../views/home'


const router = createBrowserRouter([
    {
        path: "/", element: <App />
    },
    {
        path: "/login", element: <Login />
    },
    {
        path: "/register", element: <Register />
    },
    {
        path: "/home", element: <Home />
    }
]);

export default router;