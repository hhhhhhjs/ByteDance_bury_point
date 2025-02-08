import { Input, message, Button } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Crytojs from "crypto-js";
import Instance from "../api/axios";

const Register = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [password, setpassword] = useState<string>("");
  const [username, setusername] = useState<string>("");
  const [confirmpassword, setconfirmpassword] = useState<string>("");
  const [issame, setissame] = useState<boolean>(true);

  useEffect(() => {
    if (
      password &&
      confirmpassword &&
      password.length >= 6 &&
      confirmpassword.length >= 6 &&
      password.length <= 16 &&
      confirmpassword.length <= 16
    ) {
      if (password === confirmpassword) {
        setissame(false);
      } else {
        setissame(true);
      }
    }
  }, [password, confirmpassword, issame, username]);

  const navigate = useNavigate();

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
    }, 3000);
  };

  const inputMonitor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 16) {
      message.error("密码长度不能超过16位");
      return;
    }
  };

  const vaildPassword = async () => {
    if (password !== confirmpassword) {
      message.error("两次密码不一致");
    }
    if (password === "" || confirmpassword === "") {
      message.error("密码不能为空");
    }
    if (username === "") {
      message.error("用户名不能为空");
    }
    if (
      password === confirmpassword &&
      password !== "" &&
      confirmpassword !== "" &&
      username !== ""
    ) {
      enterLoading(0);
      //TODO：等待后端返回成功，再打印注册成功
      try {
        const encryptedPassword = Crytojs.MD5(confirmpassword).toString();
        const result = await Instance.post("/api/register", {
          username,
          password: encryptedPassword,
        });
        console.log(result);

        message.success("注册成功");
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <hr className="w-4xl h-2 text-gray-300" />

      <form
        className="w-xl"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          vaildPassword();
        }}
      >
        <div className="mt-10">
          <Input
            type="text"
            placeholder="请输入用户名"
            className="w-80 h-10"
            autoComplete="username"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setusername(e.target.value);
            }}
          />
          <div className="w-full h-8">
          {password.length <= 6 && (
            <p className="text-red-400 text-xs pt-3 flex justify-end">
              密码长度必须大于6位,且小于16位
            </p>
          )}
          </div>
          <Input.Password
            placeholder="请输入密码"
            autoComplete="password"
            className="w-80 h-10"
            maxLength={16}


            style={{ marginTop: "10px" }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setpassword(e.target.value);
              inputMonitor(e);
            }}
          />
          <div className="w-full h-8"> {confirmpassword && issame && (
            <p className="text-red-400 text-xs pt-3 flex justify-end">
              两次输入密码不一致
            </p>
          )}</div>
          <Input.Password
            placeholder="请再次输入密码"
            autoComplete="currentconfirmpassword"
            className="w-80 h-10"
            style={{ marginTop: "10px" }}
            maxLength={16}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setconfirmpassword(e.target.value);
              inputMonitor(e);
            }}
          />
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-5"
            loading={loadings[0]}
          >
            注册
          </Button>
        </div>
      </form>
      <hr className="w-4xl h-2 text-gray-300 mt-10" />
    </div>
  );
};

export default Register;
