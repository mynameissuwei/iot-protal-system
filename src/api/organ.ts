import Service from "@/axios";
import { API_ENN_USER, API_ENN_SYSTEM } from "@/const";

//新增组织
export function addOrgan(data: any): Promise<any> {
  console.log(9999000, data);
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/add`,
    data,
  });
}

//编辑组织
export function updateOrgan(): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/update`,
  });
}

//删除组织
export function removeOrgan(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/remove`,
    data,
  });
}

//搜索组织
export function search(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/search`,
  });
}

//获取组织Tree
export function organTree(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/tree`,
  });
}

//获取组织成员列表
export function organMemberList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/user/list`,
    params,
  });
}

// 组织信息
export function orgDetailMsg(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/detail`,
    params,
  });
}

//组织中移除成员关联
export function refOrganMemberApi(params: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/user/remove`,
  });
}

// 账号名和昵称模糊查询列表
export function geQueryUserList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/enn-user/user/query`,
    params,
  });
}
