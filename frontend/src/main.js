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
	setConfig,
	frappeRequest,
	resourcesPlugin,
	pageMetaPlugin,
	Button,
	Input,
	TextInput,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
	Autocomplete,
	Spinner,
	FeatherIcon,
} from 'frappe-ui'

setConfig('resourceFetcher', frappeRequest);

// Initialize app with plugins
let app = createApp(App);
app.use(router);
app.use(resourcesPlugin);
app.use(pageMetaPlugin);

// Register Global Components
let globalComponents = {
	Button,
	Input,
	TextInput,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
	Autocomplete,
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
}

// Register Global Properties
app.config.globalProperties.$session = session;

// Mount to DOM
app.mount('#app');

// Redirect to Login Page
if (!session.isLoggedIn) {
	router.push({ name: 'Login' });
}

// Reload Item Data
reload_items_data();
