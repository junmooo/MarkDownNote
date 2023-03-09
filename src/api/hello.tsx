import request from "@/api/axios";

export const hello = async (params: any) => {
  return await request({
    url: `/hello/hello`,
    method: "get",
    params,
  });
};
