/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import FileUtils from "@/utils/file";
import { upload } from "@/api/files";
import store from "@/mobx";
import "./article.less";
import { observer } from "mobx-react";
import { toolbarsExclude } from "../contants";
import { useState } from "react";
import { WebviewWindow } from "@tauri-apps/api/window";
import { throttle } from "lodash";
interface Iprops {
  article: Article;
  setArticle: (article: Article) => void;
}

const Editor = observer((props: Iprops) => {
  const { article, setArticle } = props;

  const onUploadImg = throttle(
    async (files: File[], callback: (arg0: any[]) => void) => {
      const res = await Promise.all(
        files.map((file) => {
          const m = 1024 * 1024;
          let quality = 1;
          if (file.size > 8 * m) quality = 0.2;
          else if (file.size > 5 * m) quality = 0.3;
          else if (file.size > 2 * m) quality = 0.6;
          return new Promise((rev, rej) => {
            const form = new FormData();
            FileUtils.fileResizeToFile(file, quality, (res: File) => {
              form.append("file", res);
              upload(form)
                .then((res) => {
                  rev(res);
                })
                .catch((error) => rej(error));
            });
          });
        })
      );
      callback(
        res.map((item: any) => {
          return item?.url;
        })
      );
    },
    1000,
    { trailing: false }
  );
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
          editorId={"editor"}
          modelValue={article.article}
          theme="light"
          onUploadImg={onUploadImg}
          onChange={(text) => {
            setArticle({ ...article, article: text });
          }}
          tableShape={[5, 6]}
          autoDetectCode={true}
          previewTheme={store.theme}
          footers={["=", "markdownTotal"]}
          toolbarsExclude={toolbarsExclude}
        />
      </div>
    </div>
  );
});

export default Editor;
