import Service from "@/axios";
import { API_ENN_SYSTEM } from "@/const";

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
