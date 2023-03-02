/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "./article.less";
import { observer } from "mobx-react";
import { toolbarsExclude } from "./contants";
interface Iprops {
  article: Article;
}

const Article = observer((props: Iprops) => {
  const { article } = props;

  return (
    <div className="page-ctn">
      <div className="article-ctn">
        <MdEditor
          className="editor"
          editorId={"preview"}
          modelValue={article.article}
          theme="light"
          previewTheme="smart-blue"
          previewOnly={true}
          toolbarsExclude={toolbarsExclude}
        />
      </div>
    </div>
  );
});

export default Article;
