import request from "./axios";

export async function upload(params: FormData) {
  const res = await request({
    url: `/api/file/upload`,
    method: "post",
    data: params,
  });
  if (res.code === 1) {
    console.log(res);
    return Promise.resolve(res?.data || []);
  }
}
export async function uploads(params: FormData) {
  console.log(15, params.entries().next());
  const res = await request({
    url: `/api/file/uploads`,
    method: "post",
    data: params,
  });
  if (res.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}
