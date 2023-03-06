import store from "@/mobx";
import { observer } from "mobx-react";
import TreeMenu from "./TreeMenu";
import treeIcon from "@/assets/svg/tree.svg";
import rightIcon from "@/assets/svg/right.svg";
import { useBoolean } from "ahooks";
import { Key, useState } from "react";

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
            {draggable ? (
              <img
                src={rightIcon}
                alt="right"
                width={"20px"}
                onClick={() => {
                  runSaveTree({
                    id: treeData?.id,
                    tree: JSON.stringify(treeData.tree),
                  });
                  setFalse();
                }}
              />
            ) : (
              <img src={treeIcon} alt="tree" width={"20px"} onClick={setTrue} />
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
