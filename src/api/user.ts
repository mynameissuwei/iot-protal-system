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

// 获取组织列表树形
export function getOrg(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `/api/org/top`,
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
    url: `${API_ENN_SYSTEM}/role/list`,
    params,
  });
}
