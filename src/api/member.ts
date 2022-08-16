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

// 退出登录
export const logout = (data: any): any => {
  console.log(data);
  // config.headers.Authorization = 'Basic c2FiZXI6c2FiZXJfc2VjcmV'
  // return http.post('api/enn-rbac-auth/token', data)
  return Service({
    url: `${API_ENN_USER}/logout`,
    method: "get",
    // headers: {
    //   "blade-auth": `bearer ${data}`,
    //   accessToken: data,
    //   Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
    //   "Content-Type": "application/json;charset=UTF-8",
    //   "Captcha-Code": "00000",
    //   "Captcha-Key": "7db60d40-4904-4b4c-adde-71eb1666497",
    // }
  });
};
