import Service from "@/axios";
import { API_ENN_USER, API_ENN_SYSTEM } from "@/const";

//导入用户
export function importUser(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/user/import-user`,
    data,
  });
}

//用户模板 下载
export function exportTemplate(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/export-template`,
  });
}

//导出错误数据
export function exportError(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/export-error/${params.id}`,
  });
}

// 用户详情相关接口
// 获取用户详情
export function getUserDetail(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/detail`,
    params,
  });
}

//更改用户基本信息
export function updateUser(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/user/update`,
    data,
  });
}

// 获取组织列表树形
export function getOrg(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/top`,
    params,
  });
}

// 动态加载组织树子集
export function getOrgChildren(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/child`,
    params,
  });
}

// 获取角色权限
export function getRoletList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/role/list/all`,
    params,
  });
}

//获取所有组织树
export function getOrgTree(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/tree`,
  });
}

// 获取菜单树形结构
export function getMenuTree(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/menu/grant-tree`,
  });
}

//当前角色赋予的权限
export function getRolesTree(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/menu/role-tree-keys`,
    params,
  });
}

//角色增加权限
export function grantRoles(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/grant`,
    data,
  });
}
