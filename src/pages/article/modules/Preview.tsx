/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import store from "@/mobx";
import { observer } from "mobx-react";
import { toolbarsExclude } from "../contants";
import "./article.less";
import { WebviewWindow } from "@tauri-apps/api/window";
import { message } from "antd";
interface Iprops {
  article: Article;
}

const Preview = observer((props: Iprops) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { article } = props;

  const aOnClick = (e: any) => {
    const url = e.target.href;
    if (url && !url.toLowerCase()?.includes("localhost")) {
      e.preventDefault();
      new WebviewWindow("external_view", {
        url,
        width: 1400,
        height: 700,
        title: "外部链接",
      });
    }
  };

  return (
    <div className="page-ctn">
      <div className="article-ctn" onClick={aOnClick}>
        <MdEditor
          className="editor"
          editorId={"preview"}
          modelValue={article.article}
          theme="light"
          previewTheme={store.theme}
          previewOnly={true}
          toolbarsExclude={toolbarsExclude}
        />
      </div>
      {contextHolder}
    </div>
  );
});

export default Preview;
