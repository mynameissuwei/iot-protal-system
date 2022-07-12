import axios from "axios";
import { ElMsgToast } from "@enn/ency-design";

const baseURL = window._env_.baseURL;
const instance = axios.create({
  baseURL,
  timeout: 5 * 1000,
  headers: {
    "Content-Type": "application/json",
    // "X-GW-AccessKey": window._env_.accessKey,
  },
});

// http request 拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  (response) => {
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
    if (status !== 417 && status !== 418) {
      ElMsgToast.error(message);
    }
  }
);

export default instance;
