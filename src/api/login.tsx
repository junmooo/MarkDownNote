import request from "@/api/axios";
import { md5 } from "@/utils/md5";
import store from "@/mobx";
import Cookies from "js-cookie";

const login = async (params: LoginParam) => {
  params.pwd = md5(params.pwd || "");
  const res = await request({
    url: `/api/user/login`,
    method: "POST",
    data: { ...params },
  });
  console.log(res?.data.user);

  store.setUserInfo(res?.data.user);
  Cookies.set("token", res?.data.token);
  return Promise.resolve(res?.data || {});
};

const register = async (params: UserInfo) => {
  params.pwd = md5(params.pwd || "");
  return await request({
    url: `/api/user/register`,
    method: "POST",
    data: { ...params },
  });
};

const getName = async (params: UserInfo) => {
  return await request({
    url: `/api/user/getName`,
    method: "GET",
    params,
  });
};

const auth = {
  login,
  register,
  getName,
};
export default auth;
