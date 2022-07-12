import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";

//test
export function test(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_RBAC_AUTH}/captcha`,
    data: params,
  });
}
