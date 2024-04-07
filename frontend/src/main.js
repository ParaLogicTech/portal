import './index.css'

import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import moment from 'moment'
import { initSocket } from './socket'

import {flt, cint, cstr, format_number, format_currency} from '@/utils/formatting';

import { session } from '@/data/session';

import {
	currency_list,
	reload_currency_data,
} from "@/data/currency";

import {
	item_list,
	item_group_list,
	brand_list,
	standard_prices,
	item_stock,
	reload_items_data,
	setup_item_data_realtime,
} from "@/data/items";

import {
	customer_list,
	reload_customer_data,
} from "@/data/customers";

import {cart, setup_cart_realtime} from "@/data/cart";

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

// Global Variables
window.moment = moment;
window.flt = flt;
window.cint = cint;
window.cstr = cstr;
window.format_number = format_number;
window.format_currency = format_currency;

if (import.meta.env.DEV) {
	window.$session = session;
	window.$router = router;
	window.$currency_list = currency_list;
	window.$item_list = item_list;
	window.$item_group_list = item_group_list;
	window.$brand_list = brand_list;
	window.$standard_prices = standard_prices;
	window.$item_stock = item_stock;
	window.$customer_list = customer_list;
	window.$cart = cart;
	window.$alert = createAlert;
}

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

// Register Global Properties
app.config.globalProperties.$session = session;
app.config.globalProperties.format_number = format_number;
app.config.globalProperties.format_currency = format_currency;

// Mount to DOM
app.mount('#app');

// Initialize Application
if (!session.isLoggedIn) {
	router.push({ name: 'Login' });
} else {
	// Setup Socket IO
	let socket = initSocket();
	app.config.globalProperties.$socket = socket
	window.$socket = socket;

	setup_item_data_realtime();
	setup_cart_realtime();

	// Load Data
	reload_currency_data();
	reload_customer_data();
	reload_items_data();

	// Set last selected customer
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
}
