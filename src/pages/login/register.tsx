import { Button, Form, Input, message } from "antd";
import auth from "@/api/login";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.less";
import avatarIcon from "@/iconfont/svg/avatar.svg";
import Upload from "@/components/common/upload";
import { upload } from "@/api/files";
import FileUtils from "@/utils/file";

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
    console.log("file", file, quality);
    FileUtils.fileResizeToFile(file, quality, (res: File) => {
      form.append("file", res);
      console.log(form);
      upload(form)
        .then((res) => {
          setAvatar(res.url);
        })
        .catch(() => {
          messageApi.open({
            type: "error",
            content: "上传失败!",
            duration: 2000,
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
    <div className="rgst-ctn">
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        className="form-style"
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="name"
          key={"name"}
          rules={[
            { required: true, message: "Please input your username!" },
            {
              validator: async (_, value) => {
                const res = await auth.getName({ name: value });
                return res?.data === null
                  ? Promise.resolve()
                  : Promise.reject("用户名被占用!");
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="pwd"
          key={"pwd"}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" disabled={record ? true : false} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          key={"email"}
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone No" name="phoneNo" key={"phoneNo"}>
          <Input />
        </Form.Item>

        <Form.Item label="Remark" name="remark" key={"remark"}>
          <Input />
        </Form.Item>
        <Form.Item label="Avatar" name="avatar" key={"avatar"}>
          <Upload
            iconSize={"50px"}
            uploadRef={uploadRef}
            onChange={onUpload}
            formats={["jpg", "jpeg", "gif", "png", "svg"]}
            maxSize={10}
            multiple={false}
            onCheck={(msg) =>
              messageApi.open({ type: "error", content: msg, duration: 2000 })
            }
            icon={avatar || avatarIcon}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;
