import ReactECharts from "echarts-for-react";
import { option } from "../../Echarts/UserView";
import { useEffect, useRef } from "react";
import { getUvData } from "../../api/home/UvData";

const VisualBoard = () => {
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      getUvData()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
  return (
    <div>
      可视化看板
      <ReactECharts 
      theme={"dark"}
      option={option}
       />
    </div>
  );
};

export default VisualBoard;
