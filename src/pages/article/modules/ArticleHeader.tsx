import moment from "moment";
import store from "@/mobx";
import { observer } from "mobx-react";
import addIcon from "@/assets/svg/add.svg";
import editIcon from "@/assets/svg/edit.svg";
import deleteIcon from "@/assets/svg/delete.svg";
import saveIcon from "@/assets/svg/upload.svg";
import draftIcon from "@/assets/svg/draft.svg";
import importIcon from "@/assets/svg/import.svg";

type Iprops = {
  article: Article;
  setArticle: (article: Article) => void;
  toggle: () => void;
  uploadRef: any;
  runDel: (param: { id: string }) => void;
};

const ArticleHeader = observer((props: Iprops) => {
  const { article, toggle, setArticle, uploadRef, runDel } = props;
  let editFlag = store.edit;
  return (
    <div className="header">
      <div className="left">
        <div className="title">{article?.title}</div>
        <div className="description">{`作者: ${
          article.authorName
        } 创建时间: ${moment(article?.timeCreated).format(
          "YYYY-MM-DD HH:mm:SS"
        )}`}</div>
      </div>
      <div className="right">
        {!editFlag && (
          <img
            src={saveIcon}
            alt="save"
            onClick={() => {
              setArticle(article);
              toggle();
            }}
          />
        )}
        {editFlag && (
          <img
            src={editIcon}
            alt="edit"
            onClick={() => {
              // store.setDraft(article);
              store.setEditFalse();
            }}
          />
        )}
        {!editFlag && (
          <img
            src={draftIcon}
            alt="draft"
            onClick={() => {
              store.setEditTrue();
            }}
          />
        )}
        <img
          src={addIcon}
          alt="add"
          onClick={() => {
            setArticle({
              ...store.draft,
              authorId: store.userInfo?.id,
              authorName: store.userInfo?.name,
            });
            store.setEditFalse();
          }}
        />
        {editFlag && (
          <img
            src={deleteIcon}
            alt="detete"
            onClick={() => runDel({ id: article?.id || "" })}
          />
        )}
        {editFlag && (
          <img
            src={importIcon}
            alt="import"
            onClick={() => {
              uploadRef.current?.click();
            }}
          />
        )}
      </div>
    </div>
  );
});

export default ArticleHeader;
