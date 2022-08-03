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

export const deleteListRole = (data: any): Promise<any> => {
  return Service({
    url: `${API_ENN_SYSTEM}/role/remove/user`,
    method: "post",
    data,
  });
};

export function addConnectMemberRole(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/add/user`,
    data,
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
