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
  (config: any) => {
    config.headers["blade-auth"] =
      "bearer " +
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yLGFkbWluIiwidXNlcl9pZCI6IjExMjM1OTg4MjE3Mzg2NzUyMDEiLCJyb2xlX2lkIjoiMTEyMzU5ODgxNjczODY3NTIwMSwxNDY4ODA5NjYxNDg1NjkwODgyIiwidXNlcl9uYW1lIjoicm9vdCIsIm9hdXRoX2lkIjoiIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImFjY291bnQiOiJyb290IiwiY2xpZW50X2lkIjoic2FiZXIiLCJleHAiOjE2NTc2OTg5MDcsIm5iZiI6MTY1NzY5MTcwN30.9ekrkiAc-8JFYR4omx1O6KLps7f5ufve4Qbh-s7366UnlawFe7NFw7USQtA-IPZS7Vq_JvGqEe8PAWYt-MHjMA";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    const { message, status } = error.toJSON();
    if (status !== 417 && status !== 418) {
      ElMsgToast.error(message);
    }
  }
);

export default instance;
