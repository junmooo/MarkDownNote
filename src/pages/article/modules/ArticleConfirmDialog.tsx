import { Modal, Input } from "antd";

type Iprops = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  article: Article;
  setArticle: (article: Article) => void;
  title: string;
  isFolder: boolean;
};

const ArticleConfirmDialog = (props: Iprops) => {
  const { visible, onCancel, onConfirm, article, setArticle, title } = props;
  return (
    <Modal title={title} open={visible} onOk={onConfirm} onCancel={onCancel}>
      <div style={{ margin: "15px" }}>
        <Input
          placeholder="请输入"
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
