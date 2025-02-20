import axios from "axios";
import { getToken } from "./token";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 请求拦截器
Instance.interceptors.request.use((config) => {
  const token = getToken();

  const excludeUrls = ['/api/login', '/api/register']

  if (token && !excludeUrls.includes(config.url as string)) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    return config
  }

  return config;
}, (error) => {
  return Promise.reject(error);
})


// 响应拦截器
Instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    // 跳转到登录页面
    message.error(error.response.data.msg)
    const navigate = useNavigate()
    sessionStorage.clear()
    navigate('/api/login')
  }
  if(error.response.status === 409){
    message.error(error.response.data.msg)
  }
})

export default Instance;