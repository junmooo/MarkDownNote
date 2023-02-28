import request from "./axios";

export async function save(params: any) {
  const res = await request({
    url: `/api/article/save`,
    method: "post",
    data: params,
  });
  if (res.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function all(params: any) {
  const res = await request({
    url: `/api/article/all`,
    method: "get",
    params,
  });
  if (res.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function del(params: any) {
  const res = await request({
    url: `/api/article/del`,
    method: "get",
    params,
  });
  if (res.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}
