import { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/views/layout/index.vue");
const Home = () => import("@/views/home/index.vue");
const Member = () => import("@/views/member/index.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/member",
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "首页",
          key: "home",
        },
        component: Home,
      },
      {
        path: "/member",
        name: "member",
        meta: {
          title: "成员管理",
          key: "member",
        },
        component: Member,
      },
    ],
  },
];

export default routes;
