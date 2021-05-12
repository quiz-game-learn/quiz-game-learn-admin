import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import {messages} from './messages'
import Vue2Editor from "vue2-editor";
import 'vuetify/dist/vuetify.min.css';
Vue.use(VueI18n)
Vue.use(Vue2Editor as any)
Vue.config.productionTip = false
Vue.config.silent = true;

const i18n = new VueI18n({
  locale: 'es', // set locale
  messages // set locale messages
})


new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
