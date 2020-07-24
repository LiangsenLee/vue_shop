import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪儿来
  // next() 放行
  if (to.path === '/login') return next()
  // 如果是去登录,就放行
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  // 如果没token就跳转去登录
  next()
  // 有token 就放行
})
export default router
