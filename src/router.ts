import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
	{
		path: '/',
		redirect: '/food',
		component: () => import('./views/Home.vue'),
		children: [
			{
				path: '/order',
				meta: {
					title: '订单管理'
				},
				component: () => import('./views/order/index.vue')
			},
			{
				path: '/user',
				meta: {
					title: '个人中心'
				},
				component: () => import('./views/user/index.vue')
			},
			{
				path: '/food',
				meta: {
					title: '首页'
				},
				component: () => import('./views/food/index.vue')
			},
		]
	},
	{
		path: '/',
		component: () => import('./views/Home.vue'),
		children: [
			{
				path: '/order/detail',
				meta: {
					title: '订单详情'
				},
				component: () => import('./views/order/detail.vue')
			}
		]
	}
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
	if (to.meta && to.meta.title) {
		document.title = to.meta.title;
	}
	next();
});

export default router;
