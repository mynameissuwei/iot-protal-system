import Service from "@/axios";
import { API_ENN_USER, API_ENN_SYSTEM } from "@/const";

//组织中移除成员关联
export function refRoleApi(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_SYSTEM}/enn-system/role/remove`,
    data,
  });
}

export function roleListApi(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_SYSTEM}/enn-system/role/list`,
    // orgId: params.orgId
  });
}
