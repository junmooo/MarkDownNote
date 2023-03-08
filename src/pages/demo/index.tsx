import React, { useState } from "react";
import { Button, Tree, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DownOutlined } from "@ant-design/icons";

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      <Button
        onClick={() => {
          localStorage.setItem("11", Math.random().toString());
        }}
      >
        set
      </Button>
      <Button
        onClick={() => {
          messageApi.open({
            type: "info",
            duration: 6,
            content: localStorage.getItem("11"),
          });
        }}
      >
        get
      </Button>
      {contextHolder}
    </div>
  );
};

export default App;
