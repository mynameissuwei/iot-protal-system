import Service from "@/axios";
import { API_ENN_USER } from "@/const";

export function fetchData(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/backplatform/list`,
    params: params,
  });
}

export function grantData(params: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/sys/admin/grant`,
    params,
  });
}

export const createUser = (data: any): any => {
  return Service({
    url: `${API_ENN_USER}/user/submit`,
    method: "post",
    data,
  });
};

export const deleteList = (params: any): any => {
  return Service({
    url: `${API_ENN_USER}/remove`,
    method: "post",
    params,
  });
};

export function importUser(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/user/import-user`,
    data,
  });
}
