import { createRouter, createWebHistory } from 'vue-router'

const base_path = '/sales-portal'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/pages/Home.vue'),
		children: [
			{
				path: '',
				name: 'ItemListView',
				component: () => import('@/pages/ItemListView.vue')
			},
			{
				path: 'item-group-list',
				name: 'ItemGroupListView',
				component: () => import('@/pages/ItemGroupListView.vue')
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
