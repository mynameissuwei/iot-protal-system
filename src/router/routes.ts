import { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/views/layout/index.vue')
const Home = () => import('@/views/home/index.vue')


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
      }
    ]
  },
]

export default routes
