import { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/views/layout/index.vue");
const Detail = () => import("@/views/user/detail.vue");
const Member = () => import("@/views/member/index.vue");
const RoleList = () => import("@/views/roleList/index.vue");
const Role = () => import("@/views/role/index.vue");
const OrganManage = () => import("@/views/organManage/index.vue");
const RoleManage = () => import("@/views/roleManage/index.vue");
const ExteriorIdAuth = () => import("@/views/exteriorIdAuth/index.vue");
const CreateIdAuth = () => import("@/views/exteriorIdAuth/create.vue");
const StepIdAuth = () => import("@/views/exteriorIdAuth/authstep.vue");
const Complete = () => import("@/views/exteriorIdAuth/complete.vue");

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
        path: "/roleList",
        name: "roleList",
        meta: {
          title: "角色成员管理",
          key: "roleList",
        },
        component: RoleList,
      },
      {
        path: "/role",
        name: "role",
        meta: {
          title: "角色管理",
          key: "role",
        },
        component: Role,
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
      {
        path: "/roleManage",
        name: "roleManage",
        meta: {
          title: "角色管理",
          key: "roleManage",
        },
        component: RoleManage,
      },
      {
        path: "/exteriorIdAuth",
        name: "exteriorIdAuth",
        meta: {
          title: "外部身份源认证",
          key: "exteriorIdAuth",
        },
        component: ExteriorIdAuth,
      },
      {
        path: "/createIdAuth",
        name: "createIdAuth",
        meta: {
          title: "外部身份源认证",
          key: "CreateIdAuth",
        },
        component: CreateIdAuth,
      },
      {
        path: "/stepIdAuth",
        name: "stepIdAuth",
        meta: {
          title: "创建外部身份源",
          key: "stepIdAuth",
        },
        component: StepIdAuth,
      },
      {
        path: "/stepComplete",
        name: "stepComplete",
        meta: {
          title: "外部身份源创建成功",
          key: "stepComplete",
        },
        component: Complete,
      },
    ],
  },
];

export default routes;
