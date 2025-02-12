import { Input, message, Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Instance from "../api/axios";
import Crytojs from "crypto-js";
import { setToken } from "../api/token";
import { debounce } from "../api/Anti-shake";

// 登录组件

const Login = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [active, setactive] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (username && password && password.length >= 6 && password.length <= 16) {
      setactive(false);
    } else {
      setactive(true);
    }
  }, [username, password]);
  
  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };
  const inputMonitor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 16) {
      message.error("密码长度不能超过16位");
      return;
    }
  };

  // 清除输入框
  const clearInput = () => {
    setusername("");
    setpassword("");
  };

  // 提交函数
  const sendmessage = async () => {
    if (username === "" || password === "") {
      message.error("用户名或密码不能为空");
      return;
    }

    try {
      // 密码加密
      Instance.post("/api/login", {
        username,
        password: Crytojs.MD5(password).toString(),
      }).then((res) => {
        if (res.data.code === 0) {
          enterLoading(0);
          setToken(res.data.data.token);
          sessionStorage.setItem('userid', res.data.data.userid)
          message.success("登录成功");
          clearInput();
          navigate('/home')
        } else {
          message.error(res.data.msg);
          clearInput();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  // 防抖调用
  const debouncedSendMessage = debounce(sendmessage, 1000);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <p className="text-5xl font-semibold">hi,近来可好🙌</p>
      <hr className="w-4xl h-2 text-gray-300 mt-5" />

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          debouncedSendMessage()
        }}
      >
        <div className="mt-10">
          <Input
            type="text"
            placeholder="请输入用户名"
            className="w-80 h-10"
            value={username}
            autoComplete="username"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setusername(e.target.value);
            }}
          />
          <Input.Password
            placeholder="请输入密码"
            type="password"
            className="w-80 h-10"
            style={{ marginTop: "10px" }}
            autoComplete="current-password"
            value={password}
            maxLength={16}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setpassword(e.target.value);
              inputMonitor(e);
            }}
          />
          <NavLink
            to={"/register"}
            className="text-blue-500 block mt-2 text-[15px] w-30"
          >
            没有账号？去注册
          </NavLink>
          <Button
            type="primary"
            className="w-full mt-5"
            htmlType="submit"
            loading={loadings[0]}
            disabled={active}
          >
            登录
          </Button>
        </div>
      </form>
      <hr className="w-4xl h-2 text-gray-300 mt-8" />
    </div>
  );
};

export default Login;
