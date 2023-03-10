import React, { useEffect, useState } from "react";
import { Button, Tree, message } from "antd";
import { hello } from "@/api/hello";
import { useNavigate } from "react-router-dom";
import {
  exists,
  writeTextFile,
  BaseDirectory,
  createDir,
} from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState("hahahahah");

  useEffect(() => {
    invoke("close_splashscreen");
  }, []);

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
      <Button
        onClick={async () => {
          const webview = new WebviewWindow("theUniqueLabel", {
            url: "https://baidu.com/",
            width: 1400,
            height: 700,
            title: "外部链接",
          });
          // since the webview window is created asynchronously,
          // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
          webview.once("tauri://created", function () {
            // webview window successfully created
          });
          webview.once("tauri://error", function (e) {
            // an error occurred during webview window creation
          });
        }}
      >
        打开外部窗口
      </Button>

      {contextHolder}
    </div>
  );
};

export default App;
