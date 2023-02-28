/* eslint-disable no-loop-func */
import React, { useEffect, useState } from "react";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import "./article.less";
import FileUtils from "@/utils/file";
import { upload } from "@/api/files";
import { message } from "antd";

import { useBoolean, useRequest } from "ahooks";
import { save, del } from "@/api/article";
import { toolbarsExclude } from "./contants";
// import ArticleNavbar from "./modules/ArticleNavbar";
import ArticleConfirmDialog from "./modules/ArticleConfirmDialog";

interface Iprops {}

const Article = React.memo(function Article(props: Iprops) {
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const [preview, { setFalse, setTrue }] = useBoolean(true);
  const [showDialog, { toggle }] = useBoolean(false);
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const { run: runSave } = useRequest(save, {
    manual: true,
    onSuccess: (res) => {
      messageApi.open({
        type: "success",
        duration: 2000,
        content: "保存成功",
      });
      setId(res);
      setTrue();
      toggle();
    },
  });
  const { run: runDel } = useRequest(del, {
    manual: true,
    onSuccess: (res) => {
      messageApi.open({
        type: "success",
        duration: 2000,
        content: "删除成功",
      });
      navigate("/home", { state: { key: "artcle" } });
    },
  });

  useEffect(() => {
    const item = location?.state?.item;
    if (item) {
      setId(item.id);
      setText(item.article);
      setTitle(item.title);
    }
  }, [location]);

  const onConfirm = () => {
    runSave({ article: text, id, title });
  };

  // const onMenuClick = (node: Action) => {
  //   if (node.key === "preview") {
  //     setTrue();
  //   }
  //   if (node.key === "edit") {
  //     setFalse();
  //   }
  //   if (node.key === "delete") {
  //     runDel({ id });
  //   }
  // };

  const onUploadImg = async (
    files: File[],
    callback: (arg0: any[]) => void
  ) => {
    const res = await Promise.all(
      files.map((file) => {
        const m = 1024 * 1024;
        let quality = 1;
        if (file.size > 8 * m) quality = 0.3;
        else if (file.size > 5 * m) quality = 0.4;
        else if (file.size > 2 * m) quality = 0.6;
        return new Promise((rev, rej) => {
          const form = new FormData();
          FileUtils.fileResizeToFile(file, quality, (res: File) => {
            form.append("file", res);
            upload(form)
              .then((res) => {
                rev(res);
              })
              .catch((error) => rej(error));
          });
        });
      })
    );
    callback(res.map((item: any) => item?.url));
  };

  return (
    <div className="page-ctn">
      {/* <ArticleNavbar onMenuClick={onMenuClick} toggle={toggle} title={title} /> */}
      <div className="article-ctn">
        <MdEditor
          className="preview"
          editorId={"preview"}
          modelValue={text}
          theme="light"
          previewTheme="smart-blue"
          previewOnly={true}
        />
        <div
          style={{ display: `${preview ? "none" : "block"} `, width: "100%" }}
        >
          <MdEditor
            editorId={"editor"}
            className={"editor"}
            onUploadImg={onUploadImg}
            modelValue={text}
            onChange={setText}
            tableShape={[5, 10]}
            showCodeRowNumber={true}
            theme="light"
            preview={false}
            autoDetectCode={true}
            footers={["=", "markdownTotal"]}
            toolbarsExclude={toolbarsExclude}
          />
        </div>
      </div>
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

export default Article;
