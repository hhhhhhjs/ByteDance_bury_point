import { Input, message, Button, InputRef } from "antd";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  let username:string = "";
  let password1:string = "";
  let password2:string = "";

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

  const currentPassword1 = useRef<InputRef>(null);
  const currentPassword2 = useRef<InputRef>(null);

  const inputMonitor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 16) {
      message.error("密码长度不能超过16位");
      return;
    }
  };

  const vaildPassword = async () => {
    if (password1 !== password2) {
      message.error("两次密码不一致");
    }
    if (password1 === "" || password2 === "") {
      message.error("密码不能为空");
    }
    if(username === "") {
      message.error("用户名不能为空");
    }
    if (password1 === password2 && password1 !== "" && password2 !== "" && username !== "" ) {
      enterLoading(0);
      //TODO：等待后端返回成功，再打印注册成功
      message.success("注册成功");
      navigate("/login");
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
              username = e.target.value;
            }}
          />
          <Input.Password
            ref={currentPassword1}
            placeholder="请输入密码"
            autoComplete="password"
            className="w-80 h-10"
            maxLength={16}
            style={{ marginTop: "10px" }}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              password1 = e.target.value;
              inputMonitor(e);
            }}
          />
          <Input.Password
            ref={currentPassword2}
            placeholder="请再次输入密码"
            autoComplete="currentpassword2"
            className="w-80 h-10"
            style={{ marginTop: "10px" }}
            maxLength={16}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              password2 = e.target.value;
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
