import MyNavBar from "@/components/common/navbar";
import saveIcon from "@/iconfont/svg/save.svg";
import menuIcon from "@/iconfont/svg/menu.svg";
import {
  EditSOutline,
  CloseCircleOutline,
  EyeOutline,
} from "antd-mobile-icons";
import { Popover, Space } from "antd-mobile";
import { Action } from "antd-mobile/es/components/popover";
import { useNavigate } from "react-router-dom";

type Iprops = {
  onMenuClick: (node: Action) => void;
  toggle: () => void;
  title: string;
};

const ArticleNavbar = (props: Iprops) => {
  const navigate = useNavigate();
  const { onMenuClick, toggle, title } = props;
  const actions: Action[] = [
    { key: "edit", icon: <EditSOutline />, text: "修改" },
    { key: "delete", icon: <CloseCircleOutline />, text: "删除" },
    { key: "preview", icon: <EyeOutline />, text: "预览" },
  ];
  const right = (
    <div
      style={{
        fontSize: 25,
      }}
    >
      <Space style={{ marginRight: "20px" }} onClick={toggle}>
        <img src={saveIcon} width={"25px"} alt="save" />
      </Space>
      <Space>
        <Popover.Menu
          actions={actions}
          placement="bottom-start"
          onAction={onMenuClick}
          trigger="click"
        >
          <img src={menuIcon} width={"25px"} alt="menu" />
        </Popover.Menu>
      </Space>
    </div>
  );
  return (
    <MyNavBar
      right={right}
      title={title}
      back={() => navigate("/home", { state: { key: "article" } })}
    />
  );
};

export default ArticleNavbar;
