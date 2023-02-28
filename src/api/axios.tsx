import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

type Config = {
  url?: string | undefined;
  method?: string;
  params?: object;
  data?: object | string;
  cancelToken?: any;
  headers?: any;
};

function request(
  axiosConfig: Config,
  customOptions?: { repeat_request_cancel: boolean }
) {
  const service = axios.create({
    baseURL: "/",
    timeout: 60000,
  });

  // 自定义配置
  const custom_options = Object.assign(
    {
      repeat_request_cancel: true, // 是否开启取消重复请求, 默认为 true
    },
    customOptions
  );

  const errMsg = (content: string) => alert(content);

  service.interceptors.request.use(
    (config) => {
      // 自动携带token
      config.headers.token = Cookies.get("token");
      return config;
    },
    (error) => {
      errMsg(error || "出错了");
    }
  );

  service.interceptors.response.use(
    (response) => {
      if (response?.data?.code !== 1) {
        errMsg(response?.data.msg || "出错了");
      }
      return response.data;
    },
    (error) => {
      if (error.response?.status === 403) {
        window.location.href = "/login";
        errMsg("token 失效");
      } else {
        errMsg(error || "出错了");
      }
    }
  );

  return service(axiosConfig);
}

export default request;
