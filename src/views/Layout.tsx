import { Outlet } from "react-router-dom";

import Tracker from "../SDK/trackEvent";
import { useEffect } from "react";

interface sendMessage {
  userid: string;
  eventType: string;
  timestamp: number;
  event_data: {
    elementText: string | null;
    elementTag: string;
  };
  page_url: string;
}

function Layout() {
    const tracker = new Tracker({
      serverUrl: `${import.meta.env.VITE_BASE_URL}/api/trackEvent`,
      batchSize: 5,
    });

  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 查找最近的带有 data-track 属性的元素
      const trackedElement = target.closest("[data-track]");
      const userid = sessionStorage.getItem("userid");
      const timestamp = new Date().getTime();

      // 这里做了处理，在用户登录后再进行用户数据的收集
      if (trackedElement && userid) {
        const sendMessage: sendMessage = {
          userid,
          eventType: event.type,
          timestamp,
          event_data: {
            elementText: trackedElement.textContent,
            elementTag: trackedElement.tagName,
          },
          page_url: window.location.href,
        };
        try{
          const response = await tracker.track(sendMessage);
          // console.log('十秒钟后上报成功',response);
        }catch(err){
          console.log(err); 
        }
      }
    };
    document.addEventListener("click", handleClick);

    // 监听全局错误

    window.onerror = function (message, source, lineno, colno, error) {
      const errorMessage = {
        errorType: message, // 错误类型, 由于有三种错误类型，为了方便统一数据结构，将 errortype 放在最外层
        data: {
          source, // 发生错误的脚本文件的 URL
          lineno, // 发生错误的行号
          colno, // 发生错误的列号
          error, // 错误对象
        },
      };
      console.log(errorMessage);
    };

    // 监听全局 promise 错误
    window.addEventListener("unhandledrejection", function (event) {
      const errorMessage = {
        errorType: event.reason.message, // 错误类型
        data: {
          stack: event.reason.stack, // 错误堆栈信息
        },
      };
      console.log(errorMessage);
    });

    // 监听全局资源加载错误
    window.addEventListener("error", function (event) {
      const target = event.target as HTMLImageElement | HTMLLinkElement | HTMLScriptElement;
      if(target && (target.tagName === "IMG" || target.tagName === "SCRIPT" || target.tagName === "LINK")){
        const errorMessage = {
          errorType: 'Resource load error',
          data: {
            source: target instanceof HTMLImageElement ? target.src : (target instanceof (HTMLLinkElement || HTMLScriptElement)  ? target.href : ''),
          }
        }
        console.log(errorMessage);
      }
    })
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return <Outlet />;
}

export default Layout;
