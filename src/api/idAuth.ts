import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";

export function addAuth(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_RBAC_AUTH}/ldap/establish`,
    data,
  });
}

export function ldapCheck(): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_RBAC_AUTH}/ldap/check`,
  });
}

export function getAuth(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_RBAC_AUTH}/ldap/view`,
  });
}

export function editAuth(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_RBAC_AUTH}/ldap/update`,
    data,
  });
}

export function deleteAuth(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_RBAC_AUTH}/ldap/delete`,
    data,
  });
}

export function getTopoPic(): Promise<any> {
  return Service({
    method: "get",
    url: `http://10.39.25.111:8090/api/enn-iot-delivery-tool/project/getTopoPic?tenantId=000000&projectId=61`,
  });
}
