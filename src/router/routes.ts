import { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/views/layout/index.vue')
const Home = () => import('@/views/home/index.vue')
const Detail = () => import('@/views/user/detail.vue')


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/detail'
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
        path: "/detail",
        name: "detail",
        meta: {
          title: "用户详情",
          key: "detail",
        },
        component: Detail,
      },
    ]
  }
]

export default routes
