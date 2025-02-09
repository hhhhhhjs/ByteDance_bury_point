
import { getEnvInfo } from "../SDK/equipmes";
import type { IEquip } from "../SDK/types/equipmes";
import { useEffect  } from "react";
import Instance from "../api/axios";

const Home = () => {
  useEffect(() => {
    // 前端埋点，检测操作系统，浏览器
    const result: IEquip = getEnvInfo();
    // 向后端发送埋点数据
    Instance.post("/api/userequipment", result)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
