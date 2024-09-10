import './index.scss'

import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import moment from 'moment'
import { initSocket } from './socket'

import {
	flt,
	cint,
	cstr,
	format_number,
	format_currency,
	format_date,
	format_time,
	format_datetime
} from '@/utils/formatting';

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
	active_customers,
	active_customers_map,
	reload_customer_data,
	setup_customer_data_realtime,
} from "@/data/customers";

import {
	sales_person_list,
	reload_sales_person_data,
	setup_sales_person_data_realtime,
} from "@/data/sales_persons";

import {settings, reload_settings_data} from "@/data/settings";

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
window.format_date = format_date;
window.format_time = format_time;
window.format_datetime = format_datetime;

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
	window.$sales_person_list = sales_person_list;
	window.$cart = cart;
	window.$settings = settings;
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
app.config.globalProperties.$settings = settings;
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
	setup_customer_data_realtime();
	setup_sales_person_data_realtime();
	setup_cart_realtime();

	// Load Data
	reload_settings_data();
	reload_currency_data();
	reload_customer_data();
	reload_items_data();
	reload_sales_person_data();

	// Set default customer or last selected customer
	customer_list.list.promise.then(() => {
		let last_selected_customer = localStorage.getItem('last_selected_customer');
		if (last_selected_customer && !active_customers_map.value[last_selected_customer]) {
			localStorage.removeItem('last_selected_customer');
			last_selected_customer = null;
		}

		let default_customer = last_selected_customer;

		if (!default_customer && active_customers.value.length == 1) {
			let one_customer = active_customers.value[0].name;
			if (one_customer) {
				default_customer = one_customer;
			}
		}

		if (default_customer && !cart.customer) {
			cart.set_customer(default_customer, true);
		}
	});
}
