import request from "@/api/axios";
import { md5 } from "@/utils/md5";

const login = async (params: LoginParam) => {
  params.pwd = md5(params.pwd || "");
  const res = await request({
    url: `/user/login`,
    method: "POST",
    data: { ...params },
  });
  return Promise.resolve(res?.data || {});
};

const register = async (params: UserInfo) => {
  params.pwd = md5(params.pwd || "");
  return await request({
    url: `/user/register`,
    method: "POST",
    data: { ...params },
  });
};

const getName = async (params: UserInfo) => {
  return await request({
    url: `/user/getName`,
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
