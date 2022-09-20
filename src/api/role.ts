import Service from "@/axios";
import { API_ENN_SYSTEM } from "@/const";

//组织中移除成员关联
export function removeRole(params: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/remove`,
    params,
  });
}

export function roleListApi(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/role/list`,
    params: params,
  });
}

export function roleListRegister(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/ecology/functionpack`,
    params: params,
  });
}

export function roleListConfirm(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/ecology/save`,
    data,
  });
}

export function roleAddApi(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/submit`,
    data,
  });
}

export function fetchDataRoleList(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/role/list/user`,
    params: params,
  });
}

export const deleteListRole = (params: any): Promise<any> => {
  return Service({
    url: `${API_ENN_SYSTEM}/role/remove/user`,
    method: "post",
    params,
  });
};

export function addConnectMemberRole(params: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/add/user`,
    params,
  });
}

export function getRoleListMenu(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/role/list/menu`,
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

//角色增加权限
export function grantRoles(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/grant`,
    data,
  });
}
