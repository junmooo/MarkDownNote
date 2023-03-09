import { Button, Form, Input, message, Space, Spin } from "antd";
import "./login.less";
import auth from "@/api/user";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useRequest } from "ahooks";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";

const Login = observer(() => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { loading, run } = useRequest(auth.login, {
    manual: true,
    onSuccess: (res) => {
      localStorage.setItem("userInfo", JSON.stringify(res?.data.user));
      localStorage.setItem("token", res?.data.token);
      messageApi.open({
        type: "success",
        content: "登陆成功",
        duration: 2,
      });
      navigate("/articles");
    },
    onError: (err) => {
      console.log(err);
      messageApi.open({
        type: "error",
        content: err.message,
        duration: 3,
      });
    },
  });
  const onFinish = (values: any) => {
    run(values);
  };

  return (
    <div className="login-body">
      <Spin spinning={loading}>
        <header></header>
        <div className="bg" />
        <div className="login-container">
          <Form
            style={{ width: 400 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              key={"name"}
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input
                size="large"
                placeholder="请输入用户名"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="pwd"
              key={"pwd"}
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input
                prefix={<KeyOutlined />}
                size="large"
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item />
            <Form.Item>
              <div className="submit-bar">
                <Button
                  onClick={() => {
                    navigate("/register");
                  }}
                  type="link"
                >
                  注册
                </Button>
                <Button color="primary" type="primary" htmlType="submit">
                  登录
                </Button>
              </div>
            </Form.Item>
          </Form>
          {contextHolder}
        </div>
      </Spin>
    </div>
  );
});

export default Login;
