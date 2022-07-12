import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";

export function getData(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_RBAC_AUTH}/captcha`,
    data: params,
  });
}
