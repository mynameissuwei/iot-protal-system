import Service from "@/axios";
import { API_ENN_USER } from "@/const";

//新增组织
export function addOrgan(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/org/add`,
    data,
  });
}

//编辑组织
export function updateOrgan(): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/org/update`,
  });
}

//删除组织
export function removeOrgan(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/org/remove`,
    data,
  });
}

//搜索组织
export function search(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/org/search`,
  });
}

//获取组织Tree
export function organTree(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/org/tree`,
  });
}

//获取组织成员列表
export function organMemberList(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/org/user/list`,
  });
}
