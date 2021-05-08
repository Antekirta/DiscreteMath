import Vue from 'vue'
import App from './App.vue'
window.$ = window.jQuery = require('jquery');

Vue.config.productionTip = false

Vue.use({
  install: function(Vue){
    Vue.prototype.$jQuery = require('jquery'); // you'll have this.$jQuery anywhere in your vue project
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
