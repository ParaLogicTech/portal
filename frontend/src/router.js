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
				name: 'ItemListView',
				component: () => import('@/pages/MainPage/ItemListView.vue')
			},
			{
				path: 'item-groups',
				name: 'ItemGroupListView',
				component: () => import('@/pages/MainPage/ItemGroupListView.vue')
			},
			{
				path: 'brands',
				name: 'BrandListView',
				component: () => import('@/pages/MainPage/BrandListView.vue')
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
