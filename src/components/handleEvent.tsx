import { Button } from "antd";
import { useState, useEffect } from "react";

interface Item {
  key: string;
  label: string;
}

interface removeItem extends Item {
  isRemoving: boolean;
}

// 事件处理组件
export const HandleEvent = ({ Element, isclear }: { Element: Item[], isclear:boolean }) => {
  const [optionArr, setOptionArr] = useState<Item[]>(Element);

  useEffect(() => {
    // 如果 Element 变化，则更新 optionArr
    setOptionArr(Element);
  }, [Element]);

  useEffect(() => {

    // 如果 isclear 为 true，则清空数据
    if (isclear) {
      setOptionArr([]);
    }
  }, [isclear]);
  // 处理删除逻辑
  const handleRemove = (key: string) => {
    // 先触发消失动画
    setOptionArr((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, isRemoving: true } : item
      )
    );

    // 延迟删除
    setTimeout(() => {
      setOptionArr((prev) => prev.filter((item) => item.key !== key));
    }, 300); // 动画持续时间 300ms
  };

  return (
    <div className="flex flex-col gap-y-5">
      {optionArr.map((item: Item) => (
        <div
          key={item.key}
          className={`w-full h-auto transition-opacity duration-200 ease-in-out ${
            (item as removeItem).isRemoving ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex justify-between items-center bg-gray-200 shadow-lg rounded-lg">
            <p className="text-2xl h-15 ml-5" style={{ alignContent: "center" }}>
              {item.label}
            </p>
            <Button
              className="mr-10"
              danger
              onClick={() => handleRemove(item.key)}
            >
              删除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};