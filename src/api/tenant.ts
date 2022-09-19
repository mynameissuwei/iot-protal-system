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
//租户增加权限
export function tenantAuthAdd(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/tenant/set/grant`,
    data,
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
export function getEcologyListCheck(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/tenant/list/EcologyAbility`,
    params,
  });
}

// 编辑生态能力
export function editEcologyListCheck(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/tenant/set/EcologyAbility`,
    data,
  });
}

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
  return Service({
    method: "delete",
    url: `${API_ENN_SYSTEM}/ecology/remove/?ids=${data.ids}`,
  });
}

// 设定物联管理员-搜索列表
export function getAdminList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/tenant/list/user`,
    params,
  });
}
// 已添加管理员了列表
export function getYetAdminList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/tenant/list/administrator`,
    params,
  });
}
// 编辑管理员-提交
export function editAdminList(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/tenant/set/admin`,
    data,
  });
}
