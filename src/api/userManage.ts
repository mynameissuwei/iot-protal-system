import Service from "@/axios";
import { API_ENN_USER } from "@/const";

export function fetchData(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/backplatform/list`,
    params: params,
  });
}

export function grantData(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/backplatform/grant`,
    data,
  });
}
