import React, { useEffect, useState } from "react";
import { Button, Card, Avatar, Tree, message } from "antd";
import { hello } from "@/api/hello";
import { useNavigate } from "react-router-dom";
import {
  exists,
  writeTextFile,
  BaseDirectory,
  createDir,
} from "@tauri-apps/api/fs";
import { WebviewWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./index.less";
import Cards from "./modules/Cards";
import { useRequest } from "ahooks";
import { all } from "@/api/article";
import SocialHeader from "./modules/SocialHeader";

const { Meta } = Card;
const Social: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { loading, data, run } = useRequest(all, {
    manual: true,
  });

  useEffect(() => {
    run();
  }, []);
  return (
    <div className="social-ctn">
      <SocialHeader data={[]} />
      <Cards data={data} />
    </div>
  );
};
export default Social;
