import React, { Key } from "react";
import { Tree } from "antd";

import { observer } from "mobx-react";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DownOutlined } from "@ant-design/icons";
import "./tree.less";
type Iprops = {
  treeData: any;
  draggable: boolean;
  setTreeData: (data: any) => void;
  onSelect: (key: Key) => void;
  article: Article;
};

const TreeModal = observer((props: Iprops) => {

  const { treeData, setTreeData, draggable, onSelect, article } = props;
  const onDrop: TreeProps["onDrop"] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeData(data);
  };

  return (
    <div className="tree-modal">
      <Tree
        draggable={draggable}
        switcherIcon={<DownOutlined />}
        showLine={draggable}
        selectedKeys={[article.id || ""]}
        onSelect={(s) => {
          onSelect(s[0]);
        }}
        blockNode
        onDrop={onDrop}
        treeData={treeData}
      />
    </div>
  );
});

export default TreeModal;
