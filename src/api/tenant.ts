import Service from "@/axios";
import { API_ENN_SYSTEM } from "@/const";

// 功能权限树形列表
export function getMenuListTree(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/menu/tree`,
    params,
  });
}

// 获取菜单树形结构
// export function getMenuTree(): Promise<any> {
//   return Service({
//     method: "get",
//     url: `${API_ENN_SYSTEM}/menu/grant-tree`,
//   });
// }

// 获取已授权租户列表
export function getAuthList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/tenant/list/tenant`,
    params,
  });
}
