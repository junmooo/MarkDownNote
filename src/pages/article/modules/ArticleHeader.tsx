import moment, { duration } from "moment";
import store from "@/mobx";
import { observer } from "mobx-react";
import addIcon from "@/assets/svg/add.svg";
import editIcon from "@/assets/svg/edit.svg";
import deleteIcon from "@/assets/svg/delete.svg";
import saveIcon from "@/assets/svg/upload.svg";
import draftIcon from "@/assets/svg/draft.svg";
import importIcon from "@/assets/svg/import.svg";
import exportIcon from "@/assets/svg/export.svg";
import exitIcon from "@/assets/svg/exit.svg";
import magicIcon from "@/assets/svg/magic.svg";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, Tooltip, message } from "antd";
import { useRequest } from "ahooks";
import { del, save } from "@/api/article";
import Upload from "@/components/common/upload";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportMdNote } from "@/utils/common";
import { type } from "os";
const { confirm } = Modal;
type Iprops = {
  article: Article;
  setArticle: (article: Article) => void;
  treeData: any;
  setTreeData: (p: any) => void;
  getArticle: (p: { id: string }) => void;
  runSaveTree: (p: { id: string; tree: string }) => void;
};

const ArticleHeader = observer((props: Iprops) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { article, setArticle, treeData, getArticle, runSaveTree } = props;
  const [href, setHref] = useState("#");
  const [title, setTitle] = useState(article.title || "未命名");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const navigate = useNavigate();
  const uploadRef = useRef<HTMLDivElement>();
  const aRef = useRef<any>();
  let editFlag = store.edit;

  useEffect(() => {
    setHref(
      URL.createObjectURL(new Blob([article.article], { type: "text/plain" }))
    );
    setTitle(article.title || "未命名");
  }, [article]);

  const showDeleteConfirm = () => {
    confirm({
      title: "确定要删除吗?",
      icon: <ExclamationCircleFilled />,
      content: "如果该文件下有子文件,会同时级联删除",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        runDel({ id: article?.id || "" });
      },
    });
  };
  const showExitConfirm = () => {
    confirm({
      title: "确定要退出登陆吗?",
      icon: <ExclamationCircleFilled />,
      content: "退出并清空缓存!",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  const delFromTreeNode = (items: any[]) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].key === article?.id) {
        console.log("i", i, items.splice(i, 1));
        return;
      }
      if (items[i]?.children) {
        delFromTreeNode(items[i]?.children);
      }
    }
  };

  const { run: runDel } = useRequest(del, {
    manual: true,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        duration: 2,
        content: "删除成功",
      });
      // 删除以后更新 tree , 更新前先深拷贝一份
      const temp = JSON.parse(JSON.stringify(treeData));
      //从 tree中递归剔除删除的节点
      delFromTreeNode(temp.tree);
      //把 tree string 或者 obj 放回state 和 localStorage中
      runSaveTree({ id: temp.id, tree: JSON.stringify(temp.tree) });
      //删除完以后重新 focus到第一条数据
      getArticle({ id: temp.tree[0].key });
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  const getFiles = (files: FileList) => {
    const reader = new FileReader();
    const file = files[0]; //files为上传组件获取的地址
    reader.readAsText(file, "utf-8");
    reader.onload = function () {
      const result = reader?.result as string;
      setArticle({
        article: result,
        title: "",
        authorId: userInfo.id,
        authorName: userInfo.name,
      });
    };
    reader.onerror = function () {
      console.log("读取失败", reader.error);
    };
  };

  const findAndUpdateTreeData = (items: any[]) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].key === article.id) {
        if (items[i].title === article.title) {
          return;
        }
        items[i].title = article.title;
        runSaveTree({
          id: treeData?.id,
          tree: JSON.stringify(treeData.tree),
        });
        return;
      }
      if (items[i]?.children) {
        findAndUpdateTreeData(items[i]?.children);
      }
    }
  };

  const { run: runSave } = useRequest(save, {
    manual: true,
    onSuccess: (res) => {
      messageApi.open({
        type: "success",
        duration: 2,
        content: "保存成功",
      });
      const str = JSON.stringify(treeData.tree);

      // tree 中没匹配上 该 article id 说明是新增-重新维护tree,否则就是修改-tree不变
      if (!str.includes(res)) {
        // 更新tree 在最外层追加
        treeData.tree.unshift({
          key: res || "",
          title: article.title,
        });
        runSaveTree({
          id: treeData?.id,
          tree: JSON.stringify(treeData.tree),
        });
      } else {
        //修改 要更新
        localStorage.removeItem(res);
        // 检查是否修改了 title 如果有修改,要同时更新tree
        findAndUpdateTreeData(treeData.tree);
      }
      // 更新 user article tree
      // 切换编辑模式/预览模式
      store.setEditTrue();
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  return (
    <>
      <div className="header">
        <div className="left">
          <div className="title">
            {editFlag ? (
              article?.title
            ) : (
              <input
                defaultValue={title}
                className="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            )}
          </div>
          <div className="description">{`作者: ${
            article.authorName
          } 创建时间: ${moment(article?.timeCreated).format(
            "YYYY-MM-DD HH:mm:SS"
          )}`}</div>
        </div>
        <div className="right">
          {!editFlag && (
            <Tooltip title="保存到云端" color={"gray"} key={"save"}>
              <img
                src={saveIcon}
                alt="save"
                onClick={() => {
                  const tempArticle = { ...article, title };
                  setArticle(tempArticle);
                  runSave(tempArticle);
                }}
              />
            </Tooltip>
          )}
          {editFlag && (
            <Tooltip title="编辑" color={"gray"} key={"edit"}>
              <img
                src={editIcon}
                alt="edit"
                onClick={() => {
                  store.setEditFalse();
                }}
              />
            </Tooltip>
          )}
          {!editFlag && (
            <Tooltip title="保存到草稿...tudo" color={"gray"} key={"draft"}>
              <img
                src={draftIcon}
                alt="draft"
                onClick={() => {
                  store.setEditTrue();
                }}
              />
            </Tooltip>
          )}
          {editFlag && (
            <Tooltip title="新增文档" color={"gray"} key={"add"}>
              <img
                src={addIcon}
                alt="add"
                onClick={() => {
                  setArticle({
                    article: "# 标题",
                    authorId: userInfo?.id,
                    authorName: userInfo?.name,
                  });
                  store.setEditFalse();
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="变换样式" color={"gray"} key={"change"}>
            <img
              src={magicIcon}
              alt="change"
              onClick={() => store.nextTheme()}
            />
          </Tooltip>
          {editFlag && (
            <Tooltip title="删除当前文档" color={"gray"} key={"detete"}>
              <img src={deleteIcon} alt="detete" onClick={showDeleteConfirm} />
            </Tooltip>
          )}
          {editFlag && (
            <>
              <Tooltip title="导入文档" color={"gray"} key={"import"}>
                <img
                  src={importIcon}
                  alt="import"
                  onClick={() => {
                    uploadRef.current?.click();
                  }}
                />
              </Tooltip>
              <Tooltip title="导出文档" color={"gray"} key={"export"}>
                <img
                  src={exportIcon}
                  alt="export"
                  onClick={() => {
                    exportMdNote(title + ".md", article.article)
                      .then(() => {
                        messageApi.open({
                          type: "success",
                          content:
                            "导出成功，默认导出到桌面上markdowns文件夹下",
                          duration: 3,
                        });
                      })
                      .catch(() => {
                        messageApi.open({
                          type: "error",
                          content: "导出失败",
                          duration: 3,
                        });
                      });
                  }}
                />
              </Tooltip>
              <Tooltip title="退出登录" color={"gray"} key={"exit"}>
                <img src={exitIcon} alt="exit" onClick={showExitConfirm} />
              </Tooltip>
            </>
          )}
        </div>
      </div>
      {contextHolder}
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
      <a
        ref={aRef}
        download={`${article.title}.md`}
        style={{ display: "none" }}
        href={href}
      />
    </>
  );
});

export default ArticleHeader;
