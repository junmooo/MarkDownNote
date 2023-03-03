import React, { useState } from "react";
import { Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DownOutlined } from "@ant-design/icons";

const App: React.FC = () => {
  const [gData, setGData] = useState([
    {
      title: "hello",
      key: "hello",
      children: [
        {
          title: "aaa",
          key: "aaa",
          children: [
            {
              title: "ccc",
              key: "cccc",
              children: [
                {
                  title: "bbb",
                  key: "bbb",
                  children: [
                    {
                      title: "ddd",
                      key: "dddd",
                    },
                    {
                      title: "eee",
                      key: "eee",
                    },
                    {
                      title: "fff",
                      key: "fff",
                    },
                  ],
                },
                {
                  title: "ggg",
                  key: "ggg",
                  children: [
                    {
                      title: "hhh",
                      key: "hhh",
                    },
                    {
                      title: "iii",
                      key: "iii",
                    },
                    {
                      title: "jjj",
                      key: "jjj",
                    },
                  ],
                },
                {
                  title: "kkk",
                  key: "kkk",
                },
              ],
            },
            {
              title: "qqq",
              key: "qqq",
              children: [
                {
                  title: "www",
                  key: "www",
                  children: [
                    {
                      title: "zzz",
                      key: "zzz",
                    },
                    {
                      title: "xxx",
                      key: "xxx",
                    },
                    {
                      title: "vvv",
                      key: "vvv",
                    },
                  ],
                },
                {
                  title: "nnn",
                  key: "nnn",
                  children: [
                    {
                      title: "mmm",
                      key: "mmm",
                    },
                    {
                      title: "ooo",
                      key: "ooo",
                    },
                    {
                      title: "ppp",
                      key: "ppp",
                    },
                  ],
                },
                {
                  title: "ttt",
                  key: "ttt",
                },
              ],
            },
            {
              title: "rrr",
              key: "rrr",
            },
          ],
        },
        {
          title: "uuu",
          key: "uuu",
        },
      ],
    },
    {
      title: "lll",
      key: "lll",
    },
  ]);
  const [expandedKeys] = useState([]);

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log(info);
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
    const data = [...gData];

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
    console.log("data", data);

    setGData(data);
  };

  return (
    <Tree
      className="draggable-tree"
      defaultExpandedKeys={expandedKeys}
      draggable={false}
      switcherIcon={<DownOutlined />}
      showLine
      blockNode
      onDrop={onDrop}
      treeData={gData}
    />
  );
};

export default App;
