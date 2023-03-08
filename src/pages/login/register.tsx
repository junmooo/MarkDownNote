import { Button, Form, Input, message } from "antd";
import auth from "@/api/user";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.less";
import avatarIcon from "@/assets/svg/avatar.svg";
import Upload from "@/components/common/upload";
import { upload } from "@/api/files";
import FileUtils from "@/utils/file";
import {
  KeyOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

type registerType = {
  title?: string;
  record?: any;
};

function Register(props: registerType) {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { record } = props;
  const uploadRef = useRef<HTMLDivElement>();
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        values.avatar = avatar;
        auth.register(values).then(() => {
          navigate("/login");
        });
      })
      .catch((info) => {
        messageApi.open({
          type: "error",
          content: "校验失败 " + info.errorFields,
        });
      });
  };

  const onUpload = (res: FileList) => {
    const file = res[0];
    const m = 1024 * 1024;
    let quality = 1;
    if (file.size > 8 * m) quality = 0.3;
    else if (file.size > 5 * m) quality = 0.4;
    else if (file.size > 2 * m) quality = 0.6;
    const form = new FormData();
    FileUtils.fileResizeToFile(file, quality, (res: File) => {
      form.append("file", res);
      upload(form)
        .then((res) => {
          setAvatar(res.url);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "上传失败!" + err,
            duration: 2,
          });
        });
    });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [form, record]);
  return (
    <div className="rgst-body">
      <div className="bg" />
      <div className="rgst-ctn">
        {/* <Spin spinning={loading}> */}

        <Form
          form={form}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          className="form-style"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            key={"name"}
            rules={[
              { required: true, message: "请输入用户名" },
              {
                validator: async (_, value) => {
                  if (value) {
                    const res = await auth.getName({ name: value });
                    return res?.data === null
                      ? Promise.resolve()
                      : Promise.reject("用户名被占用!");
                  }
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="用户名"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="pwd"
            key={"pwd"}
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              size="large"
              placeholder="密码"
              prefix={<KeyOutlined />}
              type="password"
              disabled={record ? true : false}
            />
          </Form.Item>

          <Form.Item
            name="email"
            key={"email"}
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input size="large" placeholder="邮箱" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phoneNo"
            key={"phoneNo"}
            rules={[{ required: true, message: "请输入电话" }]}
          >
            <Input size="large" placeholder="电话" prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item name="avatar" key={"avatar"}>
            <div
              className="avatar-ctn"
              onClick={() => uploadRef.current?.click()}
            >
              <Upload
                iconSize={"50px"}
                uploadRef={uploadRef}
                onChange={onUpload}
                formats={["image/*"]}
                maxSize={10}
                multiple={false}
                onCheck={(msg) =>
                  messageApi.open({ type: "error", content: msg, duration: 2 })
                }
                // icon={avatar || avatarIcon}
              />
              <img width={"45px"} src={avatar || avatarIcon} />
              点击上传头像
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </div>
  );
}

export default Register;
