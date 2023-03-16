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

export async function getTreeByUid(params: any) {
  const res: any = await request({
    url: `/article/getTreeByUid`,
    method: "get",
    params,
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}
export async function saveTree(params: any) {
  const res: any = await request({
    url: `/article/saveTree`,
    method: "post",
    data: params,
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}

export async function getArticleById(params: any) {
  const res: any = await request({
    url: `/article/getArticleById`,
    method: "get",
    params,
  });
  if (res?.code === 1) {
    return Promise.resolve(res?.data || []);
  }
}
export async function searchArticle(params: any) {
  return await request({
    url: `/article/search`,
    method: "get",
    params,
  });
}
