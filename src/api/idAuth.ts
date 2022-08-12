import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";

export function addAuth(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_RBAC_AUTH}/ldap/establish`,
    data,
  });
}
