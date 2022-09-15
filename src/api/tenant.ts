import Service from "@/axios";
import { API_ENN_SYSTEM } from "@/const";

// 功能权限树形列表
export function getMenuListTree(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/menu/grant-tree`,
    params,
  });
}
// 已选择的功能权限树形列表
export function getCheckMenuList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/menu/role-tree-keys`,
    params,
  });
}

// 获取已授权租户列表
export function getAuthList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/tenant/list/tenant`,
    params,
  });
}

// 获取生态能力列表

// 生态能力管理列表
export function getEcologyList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/ecology/list`,
    params,
  });
}

// 删除生态能力
export function refEcologyList(data: any): Promise<any> {
  //   let dataList = params.result
  console.log(222, data);
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/ecology/remove/`,
    data,
  });
}
