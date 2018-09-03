import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Datastore from 'nedb'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// 数据库
Vue.prototype.$db = new Datastore({
  autoload: true,
  timestampData: true,
  filename: '.database/filesmanage.db'
})

Vue.prototype.$dbFormTemplate = new Datastore({
  autoload: true,
  filename: '.database/formTemplate.db'
})
// Vue.prototype.$dbFormTemplate = new Datastore('.database/formTemplate.db')
// // 加载dbFormTemplate数据库
// this.$dbFormTemplate.loadDatabase()

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
window.vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
