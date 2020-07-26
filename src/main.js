import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, {
  message
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 导入全局样式
import './assets/css/global.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截,+header 带token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
  return Promise.reject(error)
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$message = message

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
