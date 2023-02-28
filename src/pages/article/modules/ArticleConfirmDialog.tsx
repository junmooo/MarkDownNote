import { Modal, Input } from "antd";

const { confirm } = Modal;

type Iprops = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  setTitle: (val: string) => void;
};

const ArticleConfirmDialog = (props: Iprops) => {
  const { visible, onCancel, onConfirm, title = "", setTitle } = props;
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
          defaultValue={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
    </Modal>
  );
};

export default ArticleConfirmDialog;
