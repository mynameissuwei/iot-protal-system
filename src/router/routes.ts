import { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/views/layout/index.vue");
const Home = () => import("@/views/home/index.vue");
const Detail = () => import("@/views/user/detail.vue");
const Member = () => import("@/views/member/index.vue");
const OrganManage = () => import("@/views/organManage/index.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/organManage",
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
        path: "/detail",
        name: "detail",
        meta: {
          title: "用户详情",
          key: "detail",
        },
        component: Detail,
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
      {
        path: "/organManage",
        name: "organManage",
        meta: {
          title: "组织管理",
          key: "organManage",
        },
        component: OrganManage,
      },
    ],
  },
];

export default routes;
