/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import store from "@/mobx";
import { observer } from "mobx-react";
import { toolbarsExclude } from "../contants";
interface Iprops {
  article: Article;
}

const Preview = observer((props: Iprops) => {
  const { article } = props;

  return (
    <div className="page-ctn">
      <div className="article-ctn">
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
    </div>
  );
});

export default Preview;
