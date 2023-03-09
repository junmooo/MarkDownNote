import React, { useState } from "react";
import { Button, Tree, message } from "antd";
import { hello } from "@/api/hello";
import { useNavigate } from "react-router-dom";
import {
  exists,
  writeTextFile,
  BaseDirectory,
  createDir,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState("hahahahah");

  return (
    <div>
      <div>{data}</div>
      <Button
        onClick={() => {
          hello({ data: "xixixi" })
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
      <Button
        onClick={() => {
          navigate("/articles");
        }}
        type="link"
      >
        articles
      </Button>
      <Button
        onClick={async () => {
          const isexists = await exists("markdowns", {
            dir: BaseDirectory.Desktop,
          });
          console.log("isexists", isexists);
          if (!isexists) {
            await createDir("markdowns", {
              dir: BaseDirectory.Desktop,
              recursive: true,
            });
          }
          await writeTextFile("markdowns/app.conf", "file contents", {
            dir: BaseDirectory.Desktop,
          }).then((res) => {
            console.log("导出成功，默认导出到桌面上的markdowns文件夹下");
          });
        }}
      >
        writeTextFile
      </Button>

      {contextHolder}
    </div>
  );
};

export default App;
