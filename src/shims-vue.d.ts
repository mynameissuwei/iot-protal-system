/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@enncloud/enn-auth-sdk";

interface Window {
  vue: any;
  _env_: {
    baseURL: string;
    APP_ID: string;
    APP_ENV: string;
    accessKey: string;
  };
  MonitorJS: any;
}
declare var window: Window;
