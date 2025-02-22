import axios from "axios";
import { getToken } from "./token";
import { message } from "antd";

const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 请求拦截器
Instance.interceptors.request.use((config) => {
  const token = getToken();

  const excludeUrls = ['/api/login', '/api/register', '/api/trackError']

  if (token && !excludeUrls.includes(config.url as string)) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    return config
  }

  return config;
}, (error) => {
  return Promise.reject(error);
})


// const codeList = [
//   { code: 1001, msg: '用户名或者密码错误' },
//   { code: 1002, msg: 'token 过期, 请重新登录' },
//   { code: 1003, msg: '无效的 token' },
// ]
// 响应拦截器
Instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    // 跳转到登录页面

    switch (error.response.data.code) {
      case 1001:
        message.error('用户名或者密码错误')
        break;
      case 1002:
        message.error('token 过期，请重新登录')
        sessionStorage.clear()
        window.location.href = '/login'
        break;
      case 1003:
        message.error('无效的 token')
        sessionStorage.clear()
        window.location.href = '/login'
    }
  }
  if (error.response.status === 409) {
    message.error(error.response.data.msg)
  }

  return Promise.reject(error)
})

export default Instance;