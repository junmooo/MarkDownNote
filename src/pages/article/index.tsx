import { all } from "@/api/article";
import { useBoolean, useRequest } from "ahooks";
import { List, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { save } from "@/api/article";

import moment from "moment";
import Upload from "@/components/common/upload";
import ArticleConfirmDialog from "./modules/ArticleConfirmDialog";
const AriticleList = React.memo(function NotFound() {
  const [messageApi, contextHolder] = message.useMessage();
  const { loading, data, run } = useRequest(all);
  const navigete = useNavigate();
  const [text, setText] = useState("");
  const [showDialog, { toggle }] = useBoolean(false);
  const [title, setTitle] = useState("");

  const uploadRef = useRef<HTMLDivElement>();
  const { run: runSave } = useRequest(save, {
    manual: true,
    onSuccess: (res) => {
      messageApi.open({
        type: "success",
        duration: 2000,
        content: "保存成功",
      });
      run({});
      toggle();
    },
  });

  // const onMenuClick = (node: Action) => {
  //   if (node.key === "add") {
  //     navigete("/article", {
  //       state: { item: { article: "# HELLO WORLD!", title: "" } },
  //     });
  //   }
  //   if (node.key === "import") {
  //     uploadRef.current?.click();
  //   }
  // };

  const getFiles = (files: FileList) => {
    const reader = new FileReader();
    const file = files[0]; //files为上传组件获取的地址
    reader.readAsText(file, "utf-8");
    reader.onload = function () {
      const result = reader?.result as string;
      setText(result);
      toggle();
    };
    reader.onerror = function () {
      console.log("读取失败", reader.error);
    };
  };

  const onConfirm = () => {
    runSave({ article: text, title });
  };

  // const right = (
  //   <Space>
  //     <Popover.Menu
  //       actions={actions}
  //       placement="bottom-start"
  //       onAction={onMenuClick}
  //       trigger="click"
  //     >
  //       <img src={menuIcon} width={"25px"} alt="menu" />
  //     </Popover.Menu>
  //   </Space>
  // );
  return (
    <div className="article-list-ctn">
      <List className="list" header="ARTICLES">
        {data?.map((item: Article) => {
          return (
            <List.Item
              key={item.id}
              onClick={() => navigete("/article", { state: { item } })}
              // description={`作者: ${item?.authorName} 创建时间: ${moment(
              //   item?.timeCreated
              // ).format("YYYY-MM-DD HH:mm:SS")}`}
            >
              {item.title}
            </List.Item>
          );
        })}
      </List>
      <Upload
        uploadRef={uploadRef}
        onChange={getFiles}
        multiple={false}
        formats={[".md", ".txt", ".log"]}
        maxSize={1}
        onCheck={(msg) => {
          messageApi.open({ type: "error", content: msg, duration: 2000 });
        }}
      />
      <ArticleConfirmDialog
        visible={showDialog}
        onCancel={toggle}
        onConfirm={onConfirm}
        title={title}
        setTitle={setTitle}
      />
    </div>
  );
});

export default AriticleList;
