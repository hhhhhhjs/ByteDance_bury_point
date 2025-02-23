import ReactECharts from "echarts-for-react";
import { option as initoption, pieOption } from "../../Echarts/UserView";
import { useEffect, useRef, useState } from "react";
import { getUvData } from "../../api/home/UvData";
import { Select } from "antd";

interface Item {
  date: string;
  usernums: number;
}

const VisualBoard = () => {
  const hasRun = useRef(false);
  const datetamp = new Date();

  // 这里的图表的一切变化都依赖于 option 数组，相当于 两个 dom，虽然值更改了，并且需要重新渲染，否则 chart 样式不会更改
  const [option, setOption] = useState(initoption);
  const [chartType, setChartType] = useState("bar");
  const [resMes, setresMes] = useState<Item[]>([]);

  const twodays = new Date(
    datetamp.getTime() - 2 * 24 * 60 * 60 * 1000
  ).toISOString();

  const today = datetamp.toISOString();
  const week = new Date(
    datetamp.getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  const month = new Date(
    datetamp.getTime() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const threeMon = new Date(
    datetamp.getTime() - 90 * 24 * 60 * 60 * 1000 
  ).toISOString();
  const year = new Date(
    datetamp.getTime() - 365 * 24 * 60 * 60 * 1000
  ).toISOString();

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      getUvData(twodays, today)
        .then((res) => {
          const dates = res.data.data.map((item: Item) => item.date);
          const usernums = res.data.data.map((item: Item) => item.usernums);
          setOption((prevOption) => ({
            ...prevOption,
            xAxis: {
              ...prevOption.xAxis,
              data: dates,
            },
            series: [
              {
                ...prevOption.series[0],
                data: usernums,
                type: chartType,
              },
            ],
          }));
          setresMes(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [twodays, today, chartType]);

  const selectOption = [
    {
      label: "今天",
      value: `${today}&${today}`,
    },
    {
      label: "一周",
      value: `${week}&${today}`,
    },
    {
      label: "一月",
      value: `${month}&${today}`,
    },
    {
      label: "三月",
      value: `${threeMon}&${today}`,
    },
    {
      label: "一年",
      value: `${year}&${today}`,
    },
  ];

  const chartTypeOption = [
    {
      label: "柱状图",
      value: "bar",
    },
    {
      label: "折线图",
      value: "line",
    },
    {
      label: "饼图",
      value: "pie",
    },
  ];

  const updateOption = (value: string) => {
    if (value === "bar" || value === "line") {
      setOption({
        ...initoption,
        xAxis: {
          ...initoption.xAxis,
          data: resMes.map((item: Item) => item.date),
        },
        series: [
          {
            ...initoption.series[0],
            type: value,
            data: resMes.map((item: Item) => item.usernums),
          },
        ],
      });
    } else {
      setOption({
        ...pieOption,
        series: [
          {
            ...pieOption.series[0],
            type: value,
            data: resMes.map((item: Item) => ({
              name: item.date,
              value: item.usernums,
            })),
          },
        ],
      });
    }
  };

  const handleSelectTime = (value: string) => {
    const [starDate, endDate] = value.split("&");
    getUvData(starDate, endDate).then((res) => {
      setresMes(res.data.data);
      setOption({
       ...initoption,
        xAxis: {
         ...initoption.xAxis,
          data: res.data.data.map((item: Item) => item.date),
        },
        series: [
          {
           ...initoption.series[0],
            type: chartType,
            data: res.data.data.map((item: Item) => item.usernums),
          },      
        ] 
      })
    });
  };
  return (
    <div>
      <div className="ml-10 flex gap-10 font-bold">
        <div>
          <span>Select Date :</span>
          <Select
            style={{
              marginLeft: 10,
            }}
            defaultValue={"今天"}
            options={selectOption}
            defaultActiveFirstOption={true}
            onSelect={handleSelectTime}
          ></Select>
        </div>
        <div>
          <span>chartType : </span>
          <Select
            style={{
              marginLeft: 10,
              width: 100,
            }}
            options={chartTypeOption}
            onSelect={(value: string) => {
              setChartType(value);
              updateOption(value);
            }}
            defaultValue={"柱状图"}
          ></Select>
        </div>
      </div>
      <ReactECharts option={option} />
    </div>
  );
};

export default VisualBoard;
