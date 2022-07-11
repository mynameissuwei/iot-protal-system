import axios from "axios";
import { ElMsgToast } from "@enn/ency-design";

const baseURL = window._env_.baseURL;
const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "X-GW-AccessKey": window._env_.accessKey,
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
    return response.data;
  },
  (error) => {
    const { message, status } = error.toJSON();
    if (status !== 417 && status !== 418) {
      ElMsgToast.error(message);
    }
  }
);

export default instance;
