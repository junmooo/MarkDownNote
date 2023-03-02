import { all, del } from "@/api/article";
import { useBoolean, useRequest } from "ahooks";
import { Menu, MenuProps, Spin, message } from "antd";
import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./index.less";
import { save } from "@/api/article";
import addIcon from "@/assets/svg/add.svg";
import editIcon from "@/assets/svg/edit.svg";
import deleteIcon from "@/assets/svg/delete.svg";
import saveIcon from "@/assets/svg/upload.svg";
import draftIcon from "@/assets/svg/draft.svg";
import importIcon from "@/assets/svg/import.svg";
import store from "@/mobx";
import { observer } from "mobx-react";
import moment from "moment";
import Upload from "@/components/common/upload";
import ArticleConfirmDialog from "./modules/ArticleConfirmDialog";
import Editor from "./editor";
import Preview from "./preview";
import { FileMarkdownOutlined } from "@ant-design/icons";
import ArticleHeader from "./modules/ArticleHeader";

const AriticleList = observer(() => {
  const [messageApi, contextHolder] = message.useMessage();
  const editorRef = useRef<any>();
  // const navigete = useNavigate();
  const uploadRef = useRef<HTMLDivElement>();
  const [article, setArticle] = useState<Article>({ article: "" });
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const [showDialog, { toggle }] = useBoolean(false);
  const [collapsed, setCollapsed] = useState(false);
  const { run: runDel } = useRequest(del, {
    manual: true,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        duration: 2,
        content: "删除成功",
      });
      run();
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  const { loading, data, run } = useRequest(all, {
    manual: true,
    onSuccess: (res) => {
      setItems(
        res.map((item: Article) => {
          return {
            key: item.id,
            label: item.title,
            icon: <FileMarkdownOutlined />,
          };
        })
      );
      const current =
        res.find((item: Article) => {
          return item.id === article.id;
        }) || res?.[0];
      setArticle(current);
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  const { run: runSave } = useRequest(save, {
    manual: true,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        duration: 2,
        content: "保存成功",
      });
      run();
      store.setEditTrue();
      toggle();
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  useEffect(() => {
    run();
  }, []);

  const getFiles = (files: FileList) => {
    const reader = new FileReader();
    const file = files[0]; //files为上传组件获取的地址
    reader.readAsText(file, "utf-8");
    reader.onload = function () {
      const result = reader?.result as string;
      setArticle({
        article: result,
        title: "",
        authorId: store.userInfo?.id,
        authorName: store.userInfo?.name,
      });
      toggle();
    };
    reader.onerror = function () {
      console.log("读取失败", reader.error);
    };
  };

  const onConfirm = () => {
    runSave({ ...article });
  };

  const onClick = (param: any) => {
    param.domEvent.stopPropagation();
    param.domEvent.preventDefault();
    const current = data.find((item: Article) => {
      return item.id === param.key;
    });
    setArticle(current);
  };

  return (
    <Spin spinning={loading}>
      <div className="article-list-ctn">
        <div className="layout">
          <div
            className={`sider ${collapsed ? "closed" : "opened"}`}
            style={{
              display: `${store.edit ? "block" : "none"}`,
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu
              theme="light"
              className="menu"
              onClick={onClick}
              selectedKeys={[article?.id || ""]}
              mode="inline"
              inlineCollapsed={collapsed}
              items={items}
            />
          </div>

          <div
            className="content"
            style={{ height: "96vh", overflowY: "scroll" }}
          >
            <ArticleHeader
              article={article}
              setArticle={setArticle}
              toggle={toggle}
              uploadRef={uploadRef}
              runDel={runDel}
            />
            {!store.edit ? (
              <Editor article={article} setArticle={setArticle} />
            ) : (
              <Preview article={article} />
            )}
          </div>
        </div>

        <Upload
          uploadRef={uploadRef}
          onChange={getFiles}
          multiple={false}
          formats={["text/*"]}
          maxSize={1}
          onCheck={(msg) => {
            messageApi.open({ type: "error", content: msg, duration: 2 });
          }}
        />
        <ArticleConfirmDialog
          visible={showDialog}
          onCancel={toggle}
          onConfirm={onConfirm}
          article={article}
          setArticle={setArticle}
        />
      </div>
      {contextHolder}
    </Spin>
  );
});

export default AriticleList;
