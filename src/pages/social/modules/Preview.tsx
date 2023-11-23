/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import store from "@/mobx";
import { observer } from "mobx-react";
// import "./article.less";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { getArticleById } from "@/api/article";
import { useRequest } from "ahooks";

interface Iprops {
  // article: Article;
}

const Preview = observer((props: Iprops) => {
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();

  const { data, loading } = useRequest(() =>
    getArticleById({ id: new URLSearchParams(location.search).get("id") })
  );

  return (
    <Spin spinning={loading}>
      <div className="page-ctn">
        <div style={{ margin: "30px" }}>
          <MdEditor
            className="editor"
            editorId={"preview"}
            modelValue={data?.article}
            theme="light"
            previewTheme={store.theme}
            previewOnly={true}
          />
        </div>
        {contextHolder}
      </div>
    </Spin>
  );
});

export default Preview;
