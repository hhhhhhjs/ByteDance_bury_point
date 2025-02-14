import { Outlet } from "react-router-dom";

import Tracker from "../SDK/trackEvent";
import { useEffect } from "react";

function Layout() {
  //   const tracker = new Tracker({
  //     serverUrl: "127.0.0.1:8080",
  //     batchSize: 5,
  //   });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 查找最近的带有 data-track 属性的元素
      const trackedElement = target.closest("[data-track]");

      if (trackedElement) {
        // const eventType = trackedElement.dataset.track;
        console.log(event.type);
        console.log("Track event:点击了");
        console.log(trackedElement.textContent);
        console.log(window.location.href)
        // tracker.track(eventType);`
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return <Outlet />;
}

export default Layout;
