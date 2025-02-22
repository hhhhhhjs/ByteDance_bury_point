import { getEnvInfo } from "../SDK/equipmes";
import type { IEquip } from "../SDK/types/equipmes";
import { useEffect, useRef, useState } from "react";
import Instance from "../api/axios";
import { reportUserview } from "../api/home/UvData";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  AppstoreOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar } from "./homecomponent/avatar";

const { Header, Sider, Content } = Layout;
const userid = sessionStorage.getItem("userid");
const username = sessionStorage.getItem("username");

const Home = () => {
  // 使用 ref 确保在开发环境中只执行一次 effect 中的代码逻辑
  const hasrun = useRef<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    // 前端埋点，检测操作系统，浏览器
    const result: IEquip = getEnvInfo();
    // 向后端发送埋点数据

    const sendMessage = async (data: IEquip) => {
      return Instance.post("/api/userequipment", data);
    };

    const reportUVmessage = {
      userid: userid!,
      username: username!,
      visit_date: new Date().toISOString(),
    };
    if (!hasrun.current) {
      hasrun.current = true;
      Promise.all([sendMessage(result), reportUserview(reportUVmessage)])
        .then((res) => {
          console.log("promise all sucess", res);
        })
        .catch((error) => {
          console.log(error);
        });
      navigate("/home/user");
    }
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  interface IItem {
    key: string;
    icon: React.ReactNode;
    label: string;
  }

  const item: Array<IItem> = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "user",
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "reportEvent",
    },
    {
      key: "3",
      icon: <CloseOutlined />,
      label: "errorEvent",
    },
    {
      key: "4",
      icon: <CloseOutlined />,
      label: "visualBoard",
    },
  ];

  const handleSelect = (obj: any) => {
    const disobj: IItem = item.filter((item) => {
      return item.key === obj.key;
    })[0];
    navigate(`/home/${disobj.label.trim()}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={handleSelect}
          items={item}
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer, display: "flex" }}
        >
          <Button
            data-track="click"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Avatar data-track="click" className="relative left-340"></Avatar>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* 添加子路由 */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
