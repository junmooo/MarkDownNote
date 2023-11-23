import moment from "moment";
import homeIcon from "@/assets/svg/home.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { Input, Select, Space } from "antd";
import { useState } from "react";
import { usePagination, useRequest } from "ahooks";
import { searchArticle } from "@/api/article";

const { Search } = Input;
type Iprops = {
  onSearch: (v: string) => void;
  setType: (v: string) => void;
  setRegex: (v: string) => void;
};
const { Option } = Select;
function SocialHeader(props: Iprops) {
  const { setType, onSearch, setRegex } = props;
  const navigate = useNavigate();

  const selectBefore = (
    <Select
      defaultValue="content"
      size="large"
      onChange={(v) => {
        console.log("v", v);
        setType(v);
      }}
    >
      <Option value="title">文档名称</Option>
      <Option value="content">文档内容</Option>
    </Select>
  );

  return (
    <div className="header">
      <div className="home">
        <div className="search">
          <Search
            placeholder="input search text"
            allowClear
            bordered
            addonBefore={selectBefore}
            onChange={(e) => setRegex(e.target.value)}
            size="large"
            onSearch={onSearch}
          />
        </div>
        <img src={homeIcon} alt="home" onClick={() => navigate("/articles")} />
      </div>
    </div>
  );
}

export default SocialHeader;
