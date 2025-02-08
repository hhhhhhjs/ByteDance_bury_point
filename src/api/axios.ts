import axios from "axios";
import { getToken } from "./token";
import { useNavigate } from "react-router-dom";

const Instance = axios.create({
  baseURL: "http://127.0.0.1:3000",
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

    const navigate = useNavigate()
    navigate('/api/login')
  } else {
    return Promise.reject(error)
  }
})

export default Instance;