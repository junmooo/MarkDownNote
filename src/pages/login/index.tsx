import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import "./login.less";
import auth from "@/api/login";
import { useNavigate } from "react-router-dom";
import store from "@/mobx";
import { observer } from "mobx-react";
const Login = observer(() => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    auth
      .login(values)
      .then((res) => {
        console.log("res", res);
        store.setUserInfo(res?.user);
        store.setToken(res?.token);
        messageApi.open({
          type: "success",
          content: "登陆成功",
        });
        navigate("/articles");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-container">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="name"
          key={"name"}
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="pwd"
          key={"pwd"}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            onClick={() => {
              navigate("/register");
            }}
            type="primary"
          >
            注册
          </Button>
          <Button color="primary" type="primary" htmlType="submit">
            登陆
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  );
});

export default Login;
