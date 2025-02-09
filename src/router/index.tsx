import { createBrowserRouter, redirect } from "react-router-dom";
import App from "../views/App";
import Login from '../views/login'
import Register from '../views/register'
import Home from '../views/home'
import { isLogin } from "../api/islogin";
import { getToken } from "../api/token";

const router = createBrowserRouter([
    {
        path: "/", element: <App />
    },
    {
        path: "/login", element: <Login />,
        loader: () => {
            if(getToken()){
                return redirect('/home')
            }
            return null
        }
    },
    {
        path: "/register", element: <Register />
    },
    {
        path: "/home", element: <Home />,
        // 使用 react router 提供的 loader 函数来判断是否登录
        loader:isLogin
    }
]);

export default router;