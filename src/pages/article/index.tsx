import { getArticleById, saveTree, getTreeByUid } from "@/api/article";
import { useRequest } from "ahooks";
import { Spin, message } from "antd";
import { useEffect, useState } from "react";
import "./index.less";
import store from "@/mobx";
import { observer } from "mobx-react";
import Editor from "./modules/Editor";
import Preview from "./modules/Preview";
import ArticleHeader from "./modules/ArticleHeader";
import Sider from "./modules/Sider";

const AriticleList = observer(() => {
  const [messageApi, contextHolder] = message.useMessage();

  const [article, setArticle] = useState<Article>({ article: "" });
  const [treeData, setTreeData] = useState<any>();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const { run: runSaveTree, loading: updateUserLoading } = useRequest(
    saveTree,
    {
      manual: true,
      onSuccess: (res: any) => {
        res.tree = JSON.parse(res.tree);
        setTreeData(res);
        localStorage.setItem("articleTree", JSON.stringify(res));
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

  // 通过用户id获取 tree
  const { loading: loadingTree, run: getTrees } = useRequest(getTreeByUid, {
    manual: true,
    onSuccess: (res) => {
      const temp = JSON.parse(res.tree);
      res.tree = temp;
      setTreeData(res);
      localStorage.setItem("articleTree", JSON.stringify(res));
      getArticle({ id: temp?.[0]?.key });
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  // 通过 id获取文章
  const { loading, run } = useRequest(getArticleById, {
    manual: true,
    onSuccess: (res) => {
      localStorage.setItem(res.id, JSON.stringify(res));
      setArticle(res);
    },
    onError: (err) => {
      messageApi.open({
        type: "error",
        duration: 2,
        content: err.message,
      });
    },
  });

  const getArticle = (p: { id: string }) => {
    const article = JSON.parse(localStorage.getItem(p.id) || "null");
    if (article) {
      setArticle(article);
    } else {
      run(p);
    }
  };

  useEffect(() => {
    getTrees({ uid: userInfo.id });
  }, []);

  return (
    <Spin spinning={loading || loadingTree || updateUserLoading}>
      <div className="article-list-ctn">
        <div className="layout">
          <Sider
            treeData={treeData}
            runSaveTree={runSaveTree}
            setTreeData={setTreeData}
            getArticle={getArticle}
            article={article}
          />
          <div className="content">
            <ArticleHeader
              article={article}
              setArticle={setArticle}
              treeData={treeData}
              setTreeData={setTreeData}
              getArticle={getArticle}
              runSaveTree={runSaveTree}
            />
            {!store.edit ? (
              <Editor article={article} setArticle={setArticle} />
            ) : (
              <Preview article={article} />
            )}
          </div>
        </div>
      </div>
      {contextHolder}
    </Spin>
  );
});

export default AriticleList;
