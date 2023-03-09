import React, { useState } from "react";
import { Button, Tree, message } from "antd";
import { hello } from "@/api/hello";

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState("hahahahah");

  return (
    <div>
      <div>{data}</div>
      <Button
        onClick={() => {
          hello({})
            .then((res) => {
              setData("res:" + JSON.stringify(res));
            })
            .catch((err) => {
              setData("err:" + JSON.stringify(err));
            });
        }}
      >
        set
      </Button>
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
