import axios from "axios";

const pendingMap = new Map();
/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */

type Config = {
  url?: string | undefined;
  method?: string;
  params?: object;
  data?: object | string;
  headers?: any;
};

function request(axiosConfig: Config) {
  const service = axios.create({
    // baseURL: "http://127.0.0.1:8088/",
    baseURL: "https://qingbing.top/api/",
    timeout: 60000,
  });

  service.interceptors.request.use(
    (config: Config | any) => {
      // 自动携带token
      const token = localStorage.getItem("token");
      if ((!token && config.url === "/login") || config.url === "/register") {
        window.location.href = "/login";
      }
      config.headers.token = token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    (response) => {
      if (response?.data?.code !== 1) {
        return Promise.reject(response?.data.msg);
      }
      return response.data;
    },
    (error) => {
      localStorage.clear();
      let errMsg = error;
      if (error.response?.status === 403) {
        errMsg = "token 失效";
        window.location.href = "/login";
      } else {
        localStorage.clear();
      }
      return Promise.reject(errMsg);
    }
  );

  return service(axiosConfig);
}

export default request;
