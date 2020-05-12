import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		DICTIONARY: {}
  },
  mutations: {
		set_DICTIONARY(state, data) {
			state.DICTIONARY = data
		}
  },
  actions: {
  },
  modules: {
  },
});
