import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "../views/Layout";
import App from "../views/App";
import Login from '../views/login'
import Register from '../views/register'
import Home from '../views/home'
import UserPage from '../views/homecomponent/user'
import ReportEvent from "../views/homecomponent/reportEvent";
import ErrorPage from "../views/homecomponent/errorPage";
import { isLogin } from "../api/islogin";
import { getToken } from "../api/token";


const router = createBrowserRouter([
    {
        path: "/", element: <Layout />,
        children: [
            {
                path: "/", element: <App />
            },
            {
                path: "login", element: <Login />,
                loader: () => {
                    if(getToken()){
                        return redirect('/home')
                    }
                    return null
                }
            },
            {
                path: "register", element: <Register />
            },
            {
                path: "home", element: <Home />,
                // 使用 react router 提供的 loader 函数来判断是否登录
                loader:isLogin,
                children: [
                    {
                        path: "user", element: <UserPage />
                    },
                    {
                        path: "reportEvent", element: <ReportEvent /> 
                    },
                    {
                        path: "errorEvent", element: <ErrorPage />
                    }
                ]
            }  
        ]
    }
]);

export default router;