import './index.css'

import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import moment from 'moment'

import { session } from '@/data/session';

import {
	item_list,
	item_group_list,
	brand_list,
	standard_prices,
	item_stock,
	reload_items_data,
} from "@/data/items";

import {
	customer_list,
	reload_customer_data,
} from "@/data/customers";

import { cart } from "@/data/cart";

import {
	setConfig,
	frappeRequest,
	resourcesPlugin,
	pageMetaPlugin,
	ErrorMessage,
	Dialog,
	Alert,
	Spinner,
	FeatherIcon,
} from 'frappe-ui'

import {createAlert} from "@/utils/alerts";

setConfig('resourceFetcher', frappeRequest);

// Initialize app with plugins
let app = createApp(App);
app.use(router);
app.use(resourcesPlugin);
app.use(pageMetaPlugin);

// Register Global Components
let globalComponents = {
	ErrorMessage,
	Dialog,
	Alert,
	FeatherIcon,
	Spinner,
};

for (let component in globalComponents) {
	app.component(component, globalComponents[component]);
}

// Global Variables
window.moment = moment;

if (import.meta.env.DEV) {
	window.$session = session;
	window.$router = router;
	window.$item_list = item_list;
	window.$item_group_list = item_group_list;
	window.$brand_list = brand_list;
	window.$standard_prices = standard_prices;
	window.$item_stock = item_stock;
	window.$customer_list = customer_list;
	window.$cart = cart;
	window.$alert = createAlert;
}

// Register Global Properties
app.config.globalProperties.$session = session;

// Mount to DOM
app.mount('#app');

// Redirect to Login Page
if (!session.isLoggedIn) {
	router.push({ name: 'Login' });
}

// Load Data
reload_customer_data();
reload_items_data();

customer_list.list.promise.then(() => {
	let last_selected_customer = localStorage.getItem('last_selected_customer');
	if (!customer_list.dataMap[last_selected_customer]) {
		localStorage.removeItem('last_selected_customer');
		return;
	}
	if (last_selected_customer && !cart.customer) {
		cart.set_customer(last_selected_customer);
	}
});
