import request from "./axios";

export async function save(params: any) {
  const res: any = await request({
    url: `/article/save`,
    method: "post",
    data: params,
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function all() {
  const res: any = await request({
    url: `/article/all`,
    method: "get",
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function del(params: any) {
  const res: any = await request({
    url: `/article/del`,
    method: "get",
    params,
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function getTree(params: any) {
  const res: any = await request({
    url: `/user/getTree`,
    method: "get",
    params,
  });
  if (res?.code === 1) {
    console.log("res", JSON.parse(res?.data));

    return Promise.resolve(res?.data || []);
  }
}
