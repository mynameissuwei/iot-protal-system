import Service from "@/axios";
import { API_ENN_USER, API_ENN_SYSTEM } from "@/const";

//新增组织
export function addOrganApi(data: any): Promise<any> {
  console.log(9999000, data);
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/add`,
    data,
  });
}

//编辑组织
export function updateOrgan(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/update`,
    data,
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
  console.log(777777, params);
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/org/user/list?orgId=${params.id}`,
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
export function refOrganMemberApi(data: any): Promise<any> {
  console.log(666999, data);
  //   let dataList = params.result
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/user/remove`,
    data,
  });
}

// 账号名和昵称模糊查询列表
export function geQueryUserList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/query`,
    params,
  });
}

// 关联组织成员
export function addConnectMember(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/org/user/add`,
    data,
  });
}
