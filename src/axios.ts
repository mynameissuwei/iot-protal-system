import axios from "axios";
import { ElMsgToast } from "@enn/ency-design";
import website from "@/config/website";
// import { getToken } from "@/utils/auth";
import { Base64 } from "js-base64";

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
    const { code, data, msg, errorCode, errorMessage } = response.data || {};
    if (+code === 200 || errorCode === "00000") {
      return data;
    } else {
      ElMsgToast.error(
        errorMessage !== "" ? `[${errorCode}]${errorMessage}` : `${msg}`
      );
    }
    return Promise.reject(response.data); //需要在接口的catch里抓这个data
  },
  (error) => {
    //网络层错误 200 之外
    const { message, status } = error.toJSON();
    let targetOrigin1, targetOrigin2;
    const envName = process.env.NODE_ENV;
    if (envName === "DEV") {
      targetOrigin1 = "http://10.39.68.150:8081";
      targetOrigin2 = "http://10.39.68.150:8083";
    } else if (envName === "TEST") {
      targetOrigin1 = "http://10.39.68.49:8081";
      targetOrigin2 = "http://10.39.68.49:8083";
    } else {
      targetOrigin1 = "https://o-iot.ennew.com";
      targetOrigin2 = "https://console-iot.ennew.com";
    }
    if (status === 401) {
      if (window.self === window.top) {
        window.location.href =
          process.env.VUE_APP_LOGIN_URL +
          "/login?redirect=" +
          window.location.protocol +
          "//" +
          window.location.host; //  http://10.39.68.150:8082 -> dev环境的登录页面
      } else {
        window.parent.postMessage(
          {
            type: "logout",
            data: "1", // 权限数据
          },
          targetOrigin1
        );
        window.parent.postMessage(
          {
            type: "logout",
            data: "1", // 权限数据
          },
          targetOrigin2
        );
      }
    }
    if (status !== 417 && status !== 418) {
      ElMsgToast.error(message);
    }
    //兼容630之前 后端代码报错信息
    const { code, errorCode, errorMessage, msg } = error?.response?.data || {};
    if ((code !== 200 || errorCode !== "00000") && (errorMessage || msg)) {
      ElMsgToast.error(
        errorMessage !== "" ? `[${errorCode}]${errorMessage}` : `${msg}`
      );
    }
  }
);

export default instance;
