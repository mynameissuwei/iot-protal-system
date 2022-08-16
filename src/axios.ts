import axios from "axios";
import { ElMsgToast } from "@enn/ency-design";
import website from "@/config/website";
// import { getToken } from "@/utils/auth";
import { Base64 } from "js-base64";

console.log(process.env.VUE_APP_PINGTAI_PORTAL_URL);

const instance = axios.create({
  // baseURL,
  timeout: 5 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// http request 拦截器
instance.interceptors.request.use(
  (config) => {
    config.headers &&
      (config.headers["Authorization"] = `Basic ${Base64.encode(
        `${website?.clientId}:${website?.clientSecret}`
      )}`);
    config.headers &&
      (config.headers["blade-auth"] =
        "bearer " + localStorage.getItem("blade-auth")); // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// http response 拦截器
instance.interceptors.response.use(
  (response) => {
    // 网络层 状态码 200
    const { code, data, msg } = response.data || {};
    if (+code === 200) {
      return data;
    } else {
      ElMsgToast.error(`${msg}`);
    }
    return Promise.reject(response.data); //需要在接口的catch里抓这个data
  },
  (error) => {
    //网络层错误 200 之外
    const { message, status } = error.toJSON();
    if (+status === 401) {
      if (window.self === window.top) {
        window.location.href =
          process.env.VUE_APP_LOGIN_URL +
          "/login?redirect=" +
          window.location.origin;
      } else {
        window.parent.postMessage(
          {
            type: "logout",
            data: "1", // 权限数据
          },
          process.env.VUE_APP_YINGYONG_PORTAL_URL as string
        );
        window.parent.postMessage(
          {
            type: "logout",
            data: "1", // 权限数据
          },
          process.env.VUE_APP_PINGTAI_PORTAL_URL as string
        );
      }
    }
    if (+status === 400) {
      // 后端无法处理 “请求参数” 的报错，前端兼容处理
      const { msg, data } = error?.response?.data || {};
      ElMsgToast.error(msg);
      return Promise.reject(data);
    }
  }
);

export default instance;
