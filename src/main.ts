import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'amfe-flexible';
import Vant from 'vant';
import 'vant/lib/index.css';
import './mock';

Vue.use(Vant);

import Api from './utils/api'
Vue.prototype.$http = Api
import Urls from './utils/urls'
Vue.prototype.$urls = Urls
import Utils from './utils/index'
Vue.prototype.$utils = Utils

Vue.config.productionTip = false;
// 获取数据字典
Api.post('/dictionary').then((res: any) => {
	if (res.code == 0) {
		store.commit('set_DICTIONARY', res.data)
	}
	new Vue({
	  router,
	  store,
	  render: (h) => h(App),
	}).$mount('#app');
})






