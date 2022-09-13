import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";
// import { cipherMode, sm2PublicKey } from "@/utils/sm2Key.js";
// import { sm2 } from "sm-crypto";

//是否登录
export function isLoginApi(data: any): Promise<any> {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/token/check`,
    method: "get",
    headers: {
      accessToken: data,
    },
  });
}

// 退出登录
export const logout = (data: any): any => {
  console.log(data);
  return Service({
    url: `${API_ENN_RBAC_AUTH}/logout`,
    method: "get",
  });
};
