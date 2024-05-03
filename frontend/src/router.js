import { createRouter, createWebHistory } from 'vue-router'

const base_path = '/sales-portal'

const routes = [
	{
		path: '/',
		name: 'MainPage',
		component: () => import('@/pages/MainPage/MainPage.vue'),
		children: [
			{
				path: '',
				redirect: (to) => {
					return { name: 'ItemListView' }
				}
			},
			{
				path: 'items',
				name: 'ItemListView',
				component: () => import('@/pages/MainPage/ItemListView.vue'),
				meta: {
					show_cart_sidebar: true,
				},
			},
			{
				path: 'item-groups',
				name: 'ItemGroupListView',
				component: () => import('@/pages/MainPage/ItemGroupListView.vue'),
				meta: {
					show_cart_sidebar: true,
				},
			},
			{
				path: 'brands',
				name: 'BrandListView',
				component: () => import('@/pages/MainPage/BrandListView.vue'),
				meta: {
					show_cart_sidebar: true,
				},
			},
			{
				path: 'cart',
				name: 'CartView',
				component: () => import('@/pages/MainPage/CartView.vue'),
			},
			{
				path: 'orders',
				children: [
					{
						path: '',
						name: 'OrderListView',
						component: () => import('@/pages/MainPage/OrderListView.vue'),
					},
					{
						path: ':name',
						name: 'OrderView',
						props: true,
						component: () => import('@/pages/MainPage/OrderView.vue'),
					},
				]
			},
		]
	},
	{
		path: '/login',
		name: 'Login',
		beforeEnter(to, from, next) {
			window.location.replace("/login?redirect-to=" + encodeURIComponent(base_path))
		}
	}
]

let router = createRouter({
	history: createWebHistory(base_path),
	routes,
})

export default router
