// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router'
import VueRouter from 'vue-router'
import $ from 'jquery'
import { baseAjax } from '@/api/baseRequest'
import AppConfig from '@/config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

global.baseAjax = baseAjax
global.AppConfig = AppConfig

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
const instance = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

export default instance
