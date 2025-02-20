import { Table, Tag } from "antd";
import type { TableProps, PaginationProps } from "antd";
import { Tooltip } from "antd";
import Instance from "../../api/axios";
import { useEffect, useState, useRef } from "react";
import '../../styles/trackerror.css'

interface DataType {
  key: string;
  errorId: number;
  error_type: string;
  error_data: object;
  timestamp: string;
}

const getErrorMessage = async (page:number,) => {
  const res = await Instance.get("/api/getError", {
    params: {
      page: page,
      pageSize: 10,
    },
  });
  return res
};

const columns: TableProps<DataType>["columns"] = [
  {
    title: "ErrorId",
    dataIndex: "errorId",
    key: "errorId",
    render: (text) => {
      return <>
      <div className="w-8 h-8 font-bold bg-blue-100 rounded-full flex items-center justify-center animate-blink">
        {text}
      </div>
      </>
    }
  },
  {
    title: "ErrorType",
    dataIndex: "error_type",
    key: "error_type",
    render: (text) => {
      return <>
      <Tooltip title={text}>
        <Tag 
        style={{height:'2rem', fontSize:'0.8rem', alignContent:'center'}}
        bordered={false}
        color="error"
        >{text.slice(0,40)}</Tag>
      </Tooltip>
      </>
    }
  },
  {
    title: "ErrorData",
    dataIndex: "error_data",
    key: "error_data",
    render: (text) => {
      return <>
      <Tooltip title={text}>
        <Tag
        style={{height:'2rem', fontSize:'0.8rem', alignContent:'center'}}
        bordered={false}
        color="warning"
        >{text.slice(0,60)}</Tag>
      </Tooltip>
      </>
    }
  },
  {
    title: "time",
    key: "timestamp",
    dataIndex: "timestamp",
  },
];

function Errorevent() {
  const hasrun = useRef<boolean>(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [datalist, setDatalist] = useState<DataType[]>([]);
  // 项目较小，直接写死没页 10 行数据
  const pageSize = 10;
  const onChange: PaginationProps["onChange"] = (page) => {
    getErrorMessage(page).then((res) => {
      const { list } = res.data.data;
      const insertList = list.map((item:DataType) => {
        return {
         ...item,
          key: item.errorId,
          timestamp: new Date(item.timestamp).toLocaleString(),
          error_data: JSON.stringify(item.error_data),
        }
      })
      setDatalist(insertList);
      setCurrent(page);
    })
  };
  useEffect(() => {
    if(!hasrun.current){
      hasrun.current = true;
      getErrorMessage(1).then((res) => {
        const { list , total } = res.data.data;
        const insertList = list.map((item:DataType) => {
          return {
            ...item,
            key: item.errorId,
            timestamp: new Date(item.timestamp).toLocaleString(),
            error_data: JSON.stringify(item.error_data),
          }
        })
        setDatalist(insertList);
        setTotal(total);
      })
    }
  }, []);
  return (
    <div>
      <Table<DataType>
        columns={columns}
        dataSource={datalist}
        pagination={{
          pageSize: pageSize,
          total: total,
          current: current,
          onChange: onChange,
          showTitle: false,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}

export default Errorevent;
