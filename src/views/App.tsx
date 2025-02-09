import { useState, useEffect, useRef } from "react";
import { Heading } from "../components/App/heading";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function App() {
  const [currentStr, setcurrentStr] = useState<string>("");
  const hasEffectRun = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasEffectRun.current) {
      autoPrint(arr, 300, 30);
      hasEffectRun.current = true;
    }
  }, []);

  const arr: string[] = [
    "这是什么?前端埋点管理系统!\n",
    "旨在开发一个完整的埋点研发体系，提供项目用户行为分析、性能监控、报警监控的能力",
  ];

  // 自动打印
  const autoPrint = async (str: string[], linedelay: number, delay: number) => {
    for (const line of str) {
      for (const char of line) {
        setcurrentStr((prev) => prev + char);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await new Promise((resolve) => setTimeout(resolve, linedelay));
    }
  };

  // 跳转函数
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <Heading />
      <section className="w-full h-80 flex justify-center items-center">
        <div className="whitespace-pre-line text-3xl tracking-wide">
          {currentStr}
        </div>
      </section>
      <Button type="primary" className="w-full" onClick={handleClick}>
        欢迎
      </Button>
    </div>
  );
}

export default App;
