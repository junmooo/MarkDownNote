import { Modal, Input } from "antd";

type Iprops = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  article: Article;
  setArticle: (article: Article) => void;
};

const ArticleConfirmDialog = (props: Iprops) => {
  const { visible, onCancel, onConfirm, article, setArticle } = props;
  return (
    <Modal
      title="Basic Modal"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <div style={{ margin: "15px" }}>
        <Input
          placeholder="请输入标题"
          defaultValue={article.title}
          onChange={(e) => {
            setArticle({ ...article, title: e.target.value });
          }}
        />
      </div>
    </Modal>
  );
};

export default ArticleConfirmDialog;
