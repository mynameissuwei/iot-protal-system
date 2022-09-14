import { MenuInfo } from "@/types";

const menuList: MenuInfo[] = [
  {
    name: "组织管理",
    desc: "组织管理",
    key: "organManage",
    url: "/organManage",
    icon: "",
  },
  {
    name: "成员管理",
    desc: "成员管理",
    key: "member",
    url: "/member",
    icon: "",
  },
  {
    name: "角色管理",
    desc: "角色管理",
    key: "roleManage",
    url: "/roleManage",
  },
  {
    name: "外部身份源认证",
    desc: "外部身份源认证",
    key: "exteriorIdAuth",
    url: "/exteriorIdAuth",
  },
  {
    name: "已授权租户",
    desc: "已授权租户",
    key: "authTenant",
    url: "/authTenant",
  },
  {
    name: "生态能力管理",
    desc: "生态能力管理",
    key: "ecologyAbility",
    url: "/ecologyAbility",
  },
  {
    name: "平台用户管理",
    desc: "平台用户管理",
    key: "userManage",
    url: "/userManage",
  },
];
export default menuList;
