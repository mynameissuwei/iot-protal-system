import Service from "@/axios";
import { API_ENN_RBAC_AUTH } from "@/const";
import { cipherMode, sm2PublicKey } from "@/utils/sm2Key";
import { sm2 } from "sm-crypto";

//是否登录
export const isLoginApi = (data: any): any => {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/token/check`,
    method: "get",
    headers: {
      accessToken: data,
    },
  });
};

// //  LDAP
// export const ldapCheck = (): any => {
//   return Service({
//     url: `${API_ENN_RBAC_AUTH}/ldap/check`,
//     method: "post",
//   });
// };

export const getLoginCaptcha = (): any => {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/captcha`,
    method: "get",
  });
};

export const getLoginToken = (params: any): any => {
  const { account, password, ...res } = params;
  const data = {
    account: "04" + sm2.doEncrypt(account, sm2PublicKey, cipherMode),
    password: "04" + sm2.doEncrypt(password, sm2PublicKey, cipherMode),
    ...res,
  };
  return Service({
    url: `${API_ENN_RBAC_AUTH}/token`,
    method: "post",
    data,
  });
};

// 登录时获取短信验证码
export const getLoginSmsCaptcha = (data: any): any => {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/captcha/login/sms?mobile=${data}`,
    method: "get",
  });
};

// 获取手机短信验证码后登录 3   需改造 合并成一个接口了
export const codeLoginApi = (data: any): any => {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/token/sms?mobile=${data.mobile}&smsCaptcha=${data.smsCaptcha}`,
    method: "post",
  });
};

// 退出登录
export const logout = (): any => {
  return Service({
    url: `${API_ENN_RBAC_AUTH}/logout`,
    method: "get",
  });
};

// //  注册接口
// export const loginUp = (data: any): any => {
//   return Service({
//     url: "/api/enn-user/user/register/submit",
//     method: "post",
//     data,
//     headers: {
//       "Content-Type": "application/json;charset=UTF-8",
//       "Captcha-Key": data.CaptchaKey,
//       "Captcha-Code": data.CaptchaCode,
//     },
//   });
// };
