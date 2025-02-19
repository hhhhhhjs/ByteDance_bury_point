import { Button, Select } from "antd";
import { HandleEvent } from "@/components/handleEvent";
import { useEffect, useRef, useState } from "react";
import { getEvent } from "../../api/home/getEvent";
import { sendMessage } from "./types/trackMessage";

interface Item {
  key: string;
  label: string;
}

function ReportEvent() {
  const [isshow, setisshow] = useState<boolean>(false);
  const hasrun = useRef<boolean>(false);
  const userid = sessionStorage.getItem("userid");
  const [eventArr, setEventArr] = useState<Item[]>([]);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  // 是否清除数据
  const [isclear,setIsclear] = useState<boolean>(false);
  const [plusArr, setPlusArr] = useState<Item[]>([
    // 默认为 click 事件
    {
      key: "1",
      label: "click",
    },
  ]);
  const typeArr: string[] = [];
  const typeSet = new Set<string>();

  useEffect(() => {
    if (!hasrun.current) {
      hasrun.current = true;
      typeArr.length = 0;
      const sendMessage = async () => {
        const result = await getEvent(userid!);
        return result.data.data;
      };
      sendMessage().then((res) => {
        typeArr.length = 0;
        res.forEach((item: sendMessage) => {
          typeSet.add(item.event_type!);
        });
        typeArr.push(...typeSet);
        const newEventArr = typeArr.map((item, index) => ({
          key: String(index + 1),
          label: item,
          value: item,
        }));
        setEventArr(newEventArr);
        setisshow(true);
      });
    }
  }, [userid, typeArr, typeSet]);

  const filterOption = eventArr.filter((item) => {
    return !selectValue.includes(item.label);
  });

  return (
    <div>
      {/*确保拿到数据之后再渲染 select 组件 */}
      {isshow && (
        <Select
          mode="multiple"
          placeholder="Select a event"
          value={selectValue}
          onChange={(value) => {
            setSelectValue(value); // 更新 selectValue 状态
          }}
          allowClear
          showSearch
          style={{ width: 200 }}
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={filterOption}
        />
      )}

      <Button 
      className="mx-5" 
      type="primary" 
      ghost 
      data-track="click"
      onClick={() => {
        setPlusArr(
          [
            ...selectValue.map((item, index) => ({
              key: String(index + 1),
              label: item,
            })),
          ]
        )
        setSelectValue([]);
      }}
      >
        添加
      </Button>
      <Button 
      style={{ position: "absolute", right: "5rem" }} 
      danger
      onClick={() => {
        setIsclear(true);
      }}
      >
        清空
      </Button>
      <hr className="my-5 text-[#e4e3e3] border-1" />
      {/* <Button data-track="click">react 组件上报</Button> */}
      <div>
        <p className="text-base font-bold mb-5 ml-5">事件名称</p>
        <HandleEvent
          Element={plusArr}
          isclear={isclear}
        ></HandleEvent>
      </div>
    </div>
  );
}

export default ReportEvent;