import ReactECharts from "echarts-for-react";
import { option as initoption, pieOption } from "../../Echarts/UserView";
import { option as pvOption, pieoption as pvpieoption } from "../../Echarts/PageView";
import { useEffect, useRef, useState } from "react";
import { getUvData } from "../../api/home/UvData";
import { getPvData } from "../../api/home/PvData";
import { Select } from "antd";

interface Item {
  date: string;
  usernums: number;
}

interface PvItem {
  page_url: string;
  access_count: number;
}

const VisualBoard = () => {
  const hasRun = useRef(false);
  const pvhasRun = useRef(false);
  const datetamp = new Date();

  // 这里的图表的一切变化都依赖于 option 数组，相当于 两个 dom，虽然值更改了，并且需要重新渲染，否则 chart 样式不会更改
  const [option, setOption] = useState(initoption);
  const [chartType, setChartType] = useState("bar");
  const [resMes, setresMes] = useState<Item[]>([]);

  // pv 数据
  const [pvoption, setPvoption] = useState(pvOption);
  const [pvcharType, setPvchartType] = useState("bar");
  const [pvresMes, setPvresMes] = useState<PvItem[]>([]);

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
      // 初始值为今天
      getUvData(today, today)
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
  }, [today, chartType]);

  useEffect(() => {
    if (!pvhasRun.current) {
      pvhasRun.current = true;
      getPvData(today, today).then((res) => {
        const page_url = res.data.data.map((item: PvItem) => item.page_url);
        const access_count = res.data.data.map(
          (item: PvItem) => item.access_count
        );
        setPvoption((prevOption) => ({
          ...prevOption,
          xAxis: {
            ...prevOption.xAxis,
            data: page_url,
          },
          series: [
            {
              ...prevOption.series[0],
              data: access_count,
              type: pvcharType,
            },
          ],
        }));
        setPvresMes(res.data.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [today, pvcharType]);

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
        yAxis: {
          ...initoption.yAxis,
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


  const pvupdateOption = (value: string) => {
    if (value === "bar" || value === "line") {
      setPvoption({
       ...pvOption,
        xAxis: {
         ...pvOption.xAxis,
          data: pvresMes.map((item: PvItem) => item.page_url),
        },
        yAxis: {
        ...pvOption.yAxis,      
        },
        series: [
          {
          ...pvOption.series[0],
            type: value,
            data: pvresMes.map((item: PvItem) => item.access_count),
          }, 
        ]
      }) 
    }else {
      setPvoption({
      ...pvpieoption,
        series: [
          {
          ...pvpieoption.series[0],
            type: value,
            data: pvresMes.map((item: PvItem) => ({
              name: item.page_url,
              value: item.access_count,
            })),
          },
        ], 
      })
    }
  }

  const handleSelectTime = (value: string) => {
    const [starDate, endDate] = value.split("&");
    getUvData(starDate, endDate).then((res) => {
      setresMes(res.data.data);
      if (chartType === "pie") {
        setOption({
          ...pieOption,
          series: [
            {
              ...pieOption.series[0],
              type: chartType,
              data: res.data.data.map((item: Item) => ({
                name: item.date,
                value: item.usernums,
              })),
              itemStyle: undefined,
            },
          ],
        });
      } else {
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
          ],
        });
      }
    });
  };

  const pvhandleSelectTime = (value: string) => {
    const [starDate, endDate] = value.split("&");
    getPvData(starDate, endDate).then((res) => {
      setPvresMes(res.data.data);
      if (pvcharType === "pie") {
        // 修改
        setPvoption({
          ...pvpieoption,
          series: [
            {
              ...pieOption.series[0],
              type: pvcharType,
              data: res.data.data.map((item: PvItem) => ({
                name: item.page_url,
                value: item.access_count,
              })),
              itemStyle: undefined,
            },
          ],
        });
      } else {
        setPvoption({
          ...pvOption,
          xAxis: {
            ...pvOption.xAxis,
            data: res.data.data.map((item: PvItem) => item.page_url),
          },
          series: [
            {
              ...pvOption.series[0],
              type: pvcharType,
              data: res.data.data.map((item: PvItem) => item.access_count),
            },
          ],
        });
      }
    });
  }
  return (
    <div>
      <div className="ml-10 flex gap-10 font-bold text-[#4f9ce9]">
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
      <ReactECharts className="mt-8" style={{width:1400}} option={option} notMerge={true} />
      <div className="ml-10 flex gap-10 font-bold text-[#4f9ce9]">
        <div>
          <span>Select Date :</span>
          <Select
            style={{
              marginLeft: 10,
            }}
            defaultValue={"今天"}
            options={selectOption}
            defaultActiveFirstOption={true}
            onSelect={pvhandleSelectTime}
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
              setPvchartType(value);
              pvupdateOption(value);
            }}
            defaultValue={"柱状图"}
          ></Select>
        </div>
      </div>
      <ReactECharts className="mt-8" style={{width:1400}} option={pvoption} notMerge={true}></ReactECharts>
    </div>
  );
};

export default VisualBoard;
