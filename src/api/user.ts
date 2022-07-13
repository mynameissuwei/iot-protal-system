import Service from "@/axios";
import { API_ENN_USER } from "@/const";

//导入用户
export function importUser(data: any): Promise<any> {
  return Service({
    method: "post",
    url: `${API_ENN_USER}/user/import-user`,
    data,
  });
}

//用户模板 下载
export function exportTemplate(): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/export-template`,
  });
}

//导出错误数据
export function exportError(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_USER}/user/export-error/${params.id}`,
  });
}
