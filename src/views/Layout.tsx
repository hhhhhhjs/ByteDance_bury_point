import { Outlet } from "react-router-dom";
import type { sendMessage } from "./homecomponent/types/trackMessage";
import Tracker from "../SDK/trackEvent";
import { useEffect } from "react";


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
        try {
          await tracker.track(sendMessage);
        } catch (err) {
          console.log(err);
        }
      }
    };
    document.addEventListener("click", handleClick);

    // 监听全局错误

    const errorTracker = new Tracker({
      serverUrl: `${import.meta.env.VITE_BASE_URL}/api/trackError`,
      batchSize: 5,
    });
    window.onerror = async function (message, source, lineno, colno, error) {
      const errorMessage = {
        errorType: message, // 错误类型, 由于有三种错误类型，为了方便统一数据结构，将 errortype 放在最外层
        data: {
          source, // 发生错误的脚本文件的 URL
          lineno, // 发生错误的行号
          colno, // 发生错误的列号
          error, // 错误对象
        },
        timestamp: new Date().getTime(),
      };

      try {
        if (errorMessage.data.error) {
          await errorTracker.track(errorMessage);
        }  
      } catch (err) {
        console.log(err); 
      }
    };

    // 监听全局 promise 错误
    window.addEventListener("unhandledrejection", async function (event) {
      const errorMessage = {
        errorType: event.reason.message, // 错误类型
        data: {
          stack: event.reason.stack, // 错误堆栈信息
        },
        timestamp: new Date().getTime(),
      };

      try {
        if (event.reason.message && event.reason.stack) {
          await errorTracker.track(errorMessage);
        }
      } catch (err) {
        console.log(err);
      }
    });

    // 监听全局资源加载错误
    window.addEventListener("error", async function (event) {
      const target = event.target as
        | HTMLImageElement
        | HTMLLinkElement
        | HTMLScriptElement;
      if (
        target &&
        (target.tagName === "IMG" ||
          target.tagName === "SCRIPT" ||
          target.tagName === "LINK")
      ) {
        const errorMessage = {
          errorType: "Resource load error",
          data: {
            source:
              target instanceof HTMLImageElement
                ? target.src
                : target instanceof (HTMLLinkElement || HTMLScriptElement)
                ? target.href
                : "",
          },
          timestamp: new Date().getTime(),
        };
        //TODO: 发送错误信息到服务器
        try{
          if (errorMessage.data.source) {
            await errorTracker.track(errorMessage);
          }
        } catch (err) {
          console.log(err); 
        }
      }
    });


    //  // 白屏监控
    //  const checkWhiteScreen = async () => {
    //   const wrapperElements = ["html", "body", "#root"];
    //   let emptyPoints = 0;

    //   function getSelector(element: Element) {
    //     if (element.id) {
    //       return `#${element.id}`;
    //     } else if (element.className) {
    //       return `.${element.className.split(" ").filter(Boolean).join(".")}`;
    //     } else {
    //       return element.nodeName.toLowerCase();
    //     }
    //   }

    //   function isWrapperElement(element: Element) {
    //     const selector = getSelector(element);
    //     return wrapperElements.includes(selector);
    //   }

    //   document.body.addEventListener(
    //     "click",
    //     () => {
    //       emptyPoints = 0;
    //     },
    //     true
    //   );

    //   const interval = setInterval(() => {
    //     const elements = document.elementsFromPoint(
    //       window.innerWidth / 2,
    //       window.innerHeight / 2
    //     );
    //     if (elements.length) {
    //       for (let i = 0; i < elements.length; i++) {
    //         const element = elements[i];
    //         if (isWrapperElement(element)) {
    //           emptyPoints++;
    //         }
    //       }
    //     }
    //     if (emptyPoints >= 2) {
    //       const errorMessage = {
    //         errorType: "White screen error",
    //         data: {
    //           message: "White screen detected",
    //         },
    //         timestamp: new Date().getTime(),
    //       };
    //       errorTracker.track(errorMessage);
    //       clearInterval(interval);
    //     }
    //   }, 1000);

    //   return () => {
    //     clearInterval(interval);
    //   };
    // };

    // checkWhiteScreen();
     // 白屏监控
     const checkWhiteScreen = () => {
      const rootElement = document.getElementById("root"); // 假设根元素的 id 是 "root"
      if (rootElement && rootElement.children.length === 0) {
        const whiteScreenMessage = {
          errorType: "White Screen",
          data: {
            page_url: window.location.href,
          },
          timestamp: new Date().getTime(),
        };
        try {
          errorTracker.track(whiteScreenMessage);
        } catch (err) {
          console.log(err);
        }
      }
    };

    // 每隔 5 秒检查一次白屏
    const whiteScreenInterval = setInterval(checkWhiteScreen, 5000);
    return () => {
      document.removeEventListener("click", handleClick);
      clearInterval(whiteScreenInterval); // 清除定时器
    };
  }, []);
  return <Outlet />;
}

export default Layout;
