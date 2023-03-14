import moment from "moment";
import homeIcon from "@/assets/svg/home.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { Input, Select, Space } from "antd";

const { Search } = Input;
type Iprops = {
  data: Article[];
};
const { Option } = Select;
function SocialHeader(props: Iprops) {
  const { data } = props;
  const navigate = useNavigate();
  const onSearch = (value: string) => console.log(value);

  const selectBefore = (
    <Select
      defaultValue="content"
      size="large"
      onChange={(v) => {
        console.log("v", v);
      }}
    >
      <Option value="title">文档名称</Option>
      <Option value="content">文档内容</Option>
    </Select>
  );
  return (
    <div className="header">
      <div className="home">
        <img src={homeIcon} alt="home" onClick={() => navigate("/articles")} />
        <div className="search">
          <Search
            placeholder="input search text"
            allowClear
            bordered
            addonBefore={selectBefore}
            size="large"
            onSearch={onSearch}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialHeader;
