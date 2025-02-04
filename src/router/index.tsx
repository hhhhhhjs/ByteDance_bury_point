import { createBrowserRouter } from "react-router-dom";
import App from "../views/App";
import Login from '@/views/login'
import Register from '@/views/register'


const router = createBrowserRouter([
    {
        path: "/", element: <App />
    },
    {
        path: "/login", element: <Login />
    },
    {
        path: "/register", element: <Register />
    }
]);

export default router;