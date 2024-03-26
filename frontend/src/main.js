import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { session } from './data/session';

import {
	setConfig,
	frappeRequest,
	resourcesPlugin,
	Button,
	Input,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
} from 'frappe-ui'

setConfig('resourceFetcher', frappeRequest);

// Initialize app with plugins
let app = createApp(App);
app.use(router);
app.use(resourcesPlugin);

// Register Global Components
let globalComponents = {
	Button,
	Input,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
};

for (let component in globalComponents) {
	app.component(component, globalComponents[component]);
}

// Register Global Properties
app.config.globalProperties.$session = session;

// Redirect to Login Page
if (!session.isLoggedIn) {
	router.push({ name: 'Login' });
}

// Mount to DOM
app.mount('#app');

// Dev Env Vars
if (import.meta.env.DEV) {
	window.$session = session;
	window.$router = router;
}
