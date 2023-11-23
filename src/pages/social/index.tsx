import React, { useEffect, useState } from "react";
import { Card, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";
import Cards from "./modules/Cards";
import { useRequest } from "ahooks";
import { all, searchArticle } from "@/api/article";
import SocialHeader from "./modules/SocialHeader";

const { Meta } = Card;
const Social: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [type, setType] = useState<String>("content");
  const [data, setData] = useState<Article[]>([]);
  const [curr, setCurr] = useState<number>(1);
  const [regex, setRegex] = useState<String>("");
  const [totalPages, setTotalPages] = useState<number>(-1);

  const onSearch = () => {
    run({ type, curr, size: 10, regex });
  };

  const { loading, run } = useRequest(searchArticle, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 1) {
        if (curr === 1) {
          setData(res.data.records);
        } else {
          setData([...data, ...res.data.records]);
        }
        setTotalPages(res.data.pages);
        setCurr(curr + 1);
      }
    },
  });

  useEffect(() => {
    onSearch();
  }, []);

  useEffect(() => {
    if (curr !== 1) setCurr(1);
  }, [regex]);

  return (
    <Spin spinning={loading}>
      <div className="social-ctn">
        <SocialHeader
          onSearch={onSearch}
          setType={setType}
          setRegex={setRegex}
        />
        <Cards data={data} />
        {curr <= totalPages && (
          <div className="more" onClick={() => onSearch()}>
            加载更多
          </div>
        )}
      </div>
    </Spin>
  );
};
export default Social;
