import Card from "../../components/Card";
import { useEffect, useRef, useState } from "react";
import { getuserEquip } from "../../api/home/user";

function UserPage() {
  const userid: string | null = sessionStorage.getItem("userid");
  const [userdeviceArr, setuserdeviceArr] = useState<Item[]>([
    {
      label: 'userid',
      value: '',
      key: 'userid'
    },
    {
      label: "browser",
      value: "",
      key: "browser",
    },
    {
      label: "os",
      value: "",
      key: "os",
    },
    {
      label: "browser_language",
      value: "",
      key: "browser_language",
    },
    {
      label: "device_type",
      value: "",
      key: "device_type",
    },
    {
      label: 'upload_time',
      value: '',
      key: 'upload_time'
    }
  ]);
  // 开发环境也只执行一次 effect
  const hasRun = useRef<boolean>(false);

  interface Item {
    label: string;
    value: string;
    key: string;
  }
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      if (userid) {
        getuserEquip(userid).then((res) => {
          for (const key in res.data.data) {
            setuserdeviceArr((prev) => {
              return prev.map((item: Item) => {
                if (item.key === key) {
                  return {
                    ...item,
                    value: res.data.data[key],
                  };
                }
                return item;
              });
            });
          }
        });
      }
    }
  }, [userid]); // 需要根据 userid 变化时重新执行，否则因为异步的原因可能需要刷新后才会显示最新的数据

  return (
    <div className="flex flex-wrap gap-25">
      {
        userdeviceArr.map((Item: Item) => (
          <Card title={Item.label} value={Item.value} maxLength={10} key={Item.key}></Card>
        ))
      }
    </div>
  );
}

export default UserPage;
