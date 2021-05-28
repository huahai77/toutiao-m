import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Dialog } from 'vant'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    // 是否需要登录才能访问
    meta: { requiresAuth: false }
  },

  // 底部导航栏
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '', //默认子路由
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/'),
        meta: { requiresAuth: false }
      }
    ]
  },

  // 搜索
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }
  },

  // 文章详情,动态路由，需要跳转的文章id
  {
    path: '/article:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的props中，访问和维护都方便
    props: true,
    meta: { requiresAuth: false }
  },

  // 编辑我的资料
  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('@/views/my-profile'),
    meta: { requiresAuth: false }
  },

  // 聊天机器人
  {
    path: '/user/chat',
    name: 'chat',
    component: () => import('@/views/chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})


// 导航守卫
router.beforeEach((to, from, next) => {
//   to: 即将要进入的目标 路由对象
//   from: 当前导航正要离开的路由
//   next： 放行的标志
// &校验登录状态，提示用户
// 如果要进入的路由页面需要登录才能访问
  if(to.meta.requiresAuth) {
    // 再判断用户有没有登录
    if(store.state.user) {
      return next()     //登陆了直接放行，return中断操作，没登录就执行提示
    }
    Dialog.confirm({
      title: '登录提示',
      message: '该功能需要登录后才能使用喔，快去登录吧！'
    }).then(() => {   //点击确认
        // on confirm
      // 替换路由地址，通过router.currentRoute.fullPath获得解析后的 URL，记录从哪里来的
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }).catch(() => {
        // on cancel
        next(false)   //取消直接终端路由导航
      })
  }else{
    // 不需要登录能访问的页面,直接放行
    next()
  }
})

export default router
