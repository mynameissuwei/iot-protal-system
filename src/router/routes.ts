import { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/views/layout/index.vue')
const Home = () => import('@/views/home/index.vue')
const OrganManage = () => import('@/views/organManage/index.vue')


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    name: 'Layout',
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
        path: "/organManage",
        name: "organManage",
        meta: {
          title: "组织管理",
          key: "organManage",
        },
        component: OrganManage,
      }
    ]
  },
]

export default routes
