import { redirect } from 'react-router-dom';


export const isLogin = () => {
    const islogin = sessionStorage.getItem('token')
    if (!islogin) {
        // redirect 函数返回一个 response 对象，需要 return , 否则函数会返回 undefined
        return redirect("/login");
    }
    return null
}