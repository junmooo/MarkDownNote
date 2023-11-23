import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import routeConfig from "./router";
import RouterGurad from "./router/RouterGurad";
import "./App.css";
import { appWindow } from "@tauri-apps/api/window";

const App = () => {
  return (
    // <div className="ctn">
    //   <div data-tauri-drag-region className="titlebar">
    //     <div className="titlebar-button" id="titlebar-minimize">
    //       <img
    //         src="https://api.iconify.design/mdi:window-minimize.svg"
    //         alt="minimize"
    //         onClick={() => appWindow.minimize()}
    //       />
    //     </div>
    //     <div className="titlebar-button" id="titlebar-maximize">
    //       <img
    //         src="https://api.iconify.design/mdi:window-maximize.svg"
    //         alt="maximize"
    //         onClick={() => appWindow.toggleMaximize()}
    //       />
    //     </div>
    //     <div className="titlebar-button" id="titlebar-close">
    //       <img
    //         src="https://api.iconify.design/mdi:close.svg"
    //         alt="close"
    //         onClick={() => appWindow.hide()}
    //       />
    //     </div>
    //   </div>
    <React.Suspense fallback={<></>}>
      <RouterGurad routes={routeConfig} />
    </React.Suspense>
    // </div>
  );
};

export default App;
