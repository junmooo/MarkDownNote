import store from "@/mobx";
import { observer } from "mobx-react";
import TreeMenu from "./TreeMenu";
import treeIcon from "@/assets/svg/tree.svg";
import rightIcon from "@/assets/svg/right.svg";
import socialIcon from "@/assets/svg/social.svg";
import { useBoolean } from "ahooks";
import { Key, useState } from "react";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

type Iprops = {
  treeData: any;
  runSaveTree: (p: { id: string; tree: string }) => void;
  setTreeData: (p: any) => void;
  getArticle: (p: { id: string }) => void;
  article: Article;
};
const Sider = observer((props: Iprops) => {
  const { treeData, runSaveTree, setTreeData, getArticle, article } = props;
  const [draggable, { setFalse, setTrue }] = useBoolean(false);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const onSelect = (key: Key) => {
    if (!key) return;
    getArticle({ id: key.toString() });
  };
  return (
    <div
      className={`sider ${collapsed ? "closed" : "opened"}`}
      style={{
        display: `${store.edit ? "block" : "none"}`,
      }}
    >
      {!collapsed ? (
        <>
          <div className="tool-bar">
            <Tooltip title="社区" color={"gray"} key={1}>
              <img
                src={socialIcon}
                alt="right"
                onClick={() => {
                  navigate("/social");
                }}
              />
            </Tooltip>
            {draggable ? (
              <Tooltip title="保存修改" color={"gray"} key={1}>
                <img
                  src={rightIcon}
                  alt="right"
                  onClick={() => {
                    runSaveTree({
                      id: treeData?.id,
                      tree: JSON.stringify(treeData.tree),
                    });
                    setFalse();
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="修改文档层级关系和顺序" color={"gray"} key={1}>
                <img src={treeIcon} alt="tree" onClick={setTrue} />
              </Tooltip>
            )}
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
      <div onClick={() => setCollapsed(!collapsed)} className="toggle-btn" />
    </div>
  );
});

export default Sider;
