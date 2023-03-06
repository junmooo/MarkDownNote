import moment from "moment";
import store from "@/mobx";
import { observer } from "mobx-react";
import addIcon from "@/assets/svg/add.svg";
import editIcon from "@/assets/svg/edit.svg";
import deleteIcon from "@/assets/svg/delete.svg";
import saveIcon from "@/assets/svg/upload.svg";
import draftIcon from "@/assets/svg/draft.svg";
import importIcon from "@/assets/svg/import.svg";
import exportIcon from "@/assets/svg/export.svg";
import magicIcon from "@/assets/svg/magic.svg";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, message } from "antd";
import { useBoolean, useRequest } from "ahooks";
import { del, save } from "@/api/article";
import Upload from "@/components/common/upload";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import ArticleConfirmDialog from "./ArticleConfirmDialog";
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
  const [showDialog, { toggle }] = useBoolean(false);
  const [href, setHref] = useState("#");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const uploadRef = useRef<HTMLDivElement>();
  const aRef = useRef<any>();
  let editFlag = store.edit;

  useEffect(() => {
    setHref(
      URL.createObjectURL(new Blob([article.article], { type: "text/plain" }))
    );
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
      toggle();
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
      // 关闭弹窗
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

  const onConfirm = () => {
    runSave({ ...article });
  };
  return (
    <>
      <div className="header">
        <div className="left">
          <div className="title">{article?.title}</div>
          <div className="description">{`作者: ${
            article.authorName
          } 创建时间: ${moment(article?.timeCreated).format(
            "YYYY-MM-DD HH:mm:SS"
          )}`}</div>
        </div>
        <div className="right">
          {!editFlag && (
            <img
              src={saveIcon}
              alt="save"
              onClick={() => {
                setArticle(article);
                toggle();
              }}
            />
          )}
          {editFlag && (
            <img
              src={editIcon}
              alt="edit"
              onClick={() => {
                store.setEditFalse();
              }}
            />
          )}
          {!editFlag && (
            <img
              src={draftIcon}
              alt="draft"
              onClick={() => {
                store.setEditTrue();
              }}
            />
          )}
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
          <img src={magicIcon} alt="change" onClick={() => store.nextTheme()} />
          {editFlag && (
            <img src={deleteIcon} alt="detete" onClick={showDeleteConfirm} />
          )}
          {editFlag && (
            <>
              <img
                src={importIcon}
                alt="import"
                onClick={() => {
                  uploadRef.current?.click();
                }}
              />
              <img
                src={exportIcon}
                alt="import"
                onClick={() => {
                  aRef.current.click();
                }}
              />
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
      <ArticleConfirmDialog
        visible={showDialog}
        onCancel={toggle}
        onConfirm={onConfirm}
        article={article}
        setArticle={setArticle}
        title={"标题"}
        isFolder={false}
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
