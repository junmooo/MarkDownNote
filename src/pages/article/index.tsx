import { all, del } from "@/api/article";
import { useBoolean, useRequest } from "ahooks";
import { MenuProps, Spin, Tree, message } from "antd";
import { Key, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./index.less";
import { save, getTree } from "@/api/article";
import user from "@/api/user";
import store from "@/mobx";
import { observer } from "mobx-react";
import moment from "moment";
import Upload from "@/components/common/upload";
import Editor from "./modules/Editor";
import Preview from "./modules/Preview";
import treeIcon from "@/assets/svg/tree.svg";
import newFolder from "@/assets/svg/new-folder.svg";
import rightIcon from "@/assets/svg/right.svg";
import ArticleConfirmDialog from "./modules/ArticleConfirmDialog";
import ArticleHeader from "./modules/ArticleHeader";
import TreeMenu from "./modules/TreeMenu";

const AriticleList = observer(() => {
  const [messageApi, contextHolder] = message.useMessage();
  const uploadRef = useRef<HTMLDivElement>();
  const [article, setArticle] = useState<Article>({ article: "" });
  const [treeData, setTreeData] = useState<MenuProps["items"]>([]);
  const [showDialog, { toggle }] = useBoolean(false);
  const [draggable, { setFalse, setTrue }] = useBoolean(false);
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

  const { run: update, loading: updateUserLoading } = useRequest(
    user.updateUserArticleTree,
    {
      manual: true,
      onSuccess: (res: any) => {
        setTreeData(res.data);
      },
      onError: (err) => {
        messageApi.open({
          type: "error",
          duration: 2,
          content: err.message,
        });
      },
    }
  );
  const { loading: loadingTree, run: getTrees } = useRequest(getTree, {
    manual: true,
    onSuccess: (res) => {
      setTreeData(res);
      const current = data.find((item: Article) => {
        return item.id === res?.[0].key;
      });
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

  const { loading, data, run } = useRequest(all, {
    manual: true,
    onSuccess: (res) => {
      getTrees({ uid: store.userInfo.id });
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

  const onSelect = (key: Key) => {
    if (!key) return;
    const current = data.find((item: Article) => {
      return item.id === key;
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
          >
            {!collapsed ? (
              <>
                <div className="tool-bar">
                  {draggable ? (
                    <img
                      src={rightIcon}
                      alt="right"
                      width={"20px"}
                      onClick={() => {
                        update({
                          id: store.userInfo.id,
                          articleTree: JSON.stringify(treeData),
                        });
                        setFalse();
                      }}
                    />
                  ) : (
                    <img
                      src={treeIcon}
                      alt="tree"
                      width={"20px"}
                      onClick={setTrue}
                    />
                  )}
                  {/* <img src={newFolder} alt="new" width={"20px"} onClick={toggle} /> */}
                </div>
                <TreeMenu
                  treeData={treeData}
                  draggable={draggable}
                  setTreeData={setTreeData}
                  onSelect={onSelect}
                  article={article}
                />
              </>
            ) : null}
            <div
              onClick={() => setCollapsed(!collapsed)}
              className="toggle-btn"
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
          title={"标题"}
          isFolder={false}
        />
      </div>
      {contextHolder}
    </Spin>
  );
});

export default AriticleList;
