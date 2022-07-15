import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import EncyDesign from "@enn/ency-design";
import components from "./components";
import "@enn/ency-design/dist/index.css";
import "@/assets/css/main.less";
import "@/assets/images/svg-icon";
import { getParam } from "@/utils/auth";
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
const app = createApp(App);
// app.use(pinia);
// const win = window;
// // eslint-disable-next-line no-unexpected-multiline
// (async function () {
//   try {
//     const authSdk = await EnnAuthSdk({
//       appid: window._env_.APP_ID, // 项目APPID
//       baseUrl: window._env_.baseURL, // 该前端对应的后端接口服务的地址(需保证该后端服务也集成了后端的鉴权sdk)
//       env: window._env_.APP_ENV, // 当前运行环境 NEW_DEV（新智测试环境）NEW_PRO(新智生产环境多租户版本) NEW_PRO_ONLINE(新智生产环境多租户版本对外域名)
//       accessKey: window._env_.accessKey, // 网关key
//       // eslint-disable-next-line @typescript-eslint/no-empty-function
//       warningCb: (messgae: string) => {
//         console.log(messgae, "message");
//       }, // 错误提示回调函数
//     });
//     app.config.globalProperties.authSdk = authSdk; // 将实例挂载至vue原型链中，以便其它组件调用 登出功能 （this.authSdk.logout()） 切换租户功能(this.authSdk.selectTenant())
//     win.vue = app;
initVue();
//   } catch (e) {
//     console.log(e);
//     // 处理获取token异常情况
//     // 如果出现authentiation接口返回418和业务接口返沪417，然后一直循环跳鉴权页，则不要在这里 initVue()
//   }
// })();

// 实例化VUE
function initVue() {
  app
    .use(pinia.use(piniaPluginPersist))
    .use(router)
    .use(EncyDesign)
    .use(components)
    .mount("#app");
  const iotBladeAuth = getParam("bladeAuth") || "";
  if (iotBladeAuth && window.location.href.indexOf("/blank") === -1) {
    localStorage.clear();
    localStorage.setItem("blade-auth", iotBladeAuth);
  }

  // // 添加监控
  // new window.MonitorJS().init({
  //   pageId: "enn-fe-standard-vue3", // 上线应用id
  //   env:
  //     process.env.NODE_ENV === "development"
  //       ? window.MonitorJS.EnnDEV
  //       : window.MonitorJS.EnnPROD, // 上报错误地址
  //   consoleError: true,
  //   vueError: true, // 是否上报Vue错误
  //   vue: app,
  // });

  // new window.MonitorJS().monitorPerformance({
  //   pageId: "enn-fe-standard-vue3",
  //   env:
  //     process.env.NODE_ENV === "development"
  //       ? window.MonitorJS.EnnDEV
  //       : window.MonitorJS.EnnPROD, // 上报错误地址
  //   isRXHR: false,
  //   isPage: true,
  // });
}
