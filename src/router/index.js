import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/')
  },
  {
    // 底部导航栏
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '', //默认子路由
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
