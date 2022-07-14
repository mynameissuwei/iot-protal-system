import Service from "@/axios";
import { API_ENN_USER } from "@/const";

export function fetchData(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/list`,
    params: params,
  });
}

export const deleteList = (params: any): any => {
  return Service({
    url: `${API_ENN_USER}/user/remove`,
    method: "post",
    params,
  });
};

export const createUser = (data: any): any => {
  return Service({
    url: `${API_ENN_USER}/user/submit`,
    method: "post",
    data,
  });
};
