import Service from "@/axios";
import { API_ENN_SYSTEM } from "@/const";

export function fetchData(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/role/list/user`,
    params: params,
  });
}

export const deleteList = (params: any): any => {
  return Service({
    url: `${API_ENN_SYSTEM}/role/remove/user`,
    method: "post",
    params,
  });
};

export function addConnectMember(data: any): any {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/role/add/user`,
    data,
  });
}
