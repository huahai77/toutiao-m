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

  // 底部导航栏
  {
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
  },

  // 搜索
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/')
  },

  // 文章详情,动态路由，需要跳转的文章id
  {
    path: '/article:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的props中，访问和维护都方便
    props: true
  },

  // 编辑我的资料
  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('@/views/my-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
