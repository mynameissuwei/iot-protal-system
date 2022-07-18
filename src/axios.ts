import axios from "axios";
import { ElMsgToast } from "@enn/ency-design";
import website from "@/config/website";
// import { getToken } from "@/utils/auth";
import { Base64 } from "js-base64";

// const baseURL = window._env_.baseURL;
const instance = axios.create({
  // baseURL,
  timeout: 5 * 1000,
  headers: {
    "Content-Type": "application/json",
    // "X-GW-AccessKey": window._env_.accessKey,
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
    // debugger;
    const { code, data, msg } = response.data || {};
    if (+code === 200) {
      return data;
    } else {
      ElMsgToast.error(msg);
    }

    return Promise.reject(response.data); //需要在接口的catch里抓这个data
  },
  (error) => {
    const { message, status } = error.toJSON();
    if (status === 401) {
      ElMsgToast.error(message);
      window.location.href =
        "http://10.39.68.150:8082" +
        "/login?redirect=" +
        window.location.protocol +
        "//" +
        window.location.host;
    }
    if (status !== 417 && status !== 418) {
      ElMsgToast.error(message);
    }
  }
);

export default instance;
