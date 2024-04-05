import { reactive } from "vue";
import { createResource } from "frappe-ui";
import { ref } from 'vue';

export let _selected_customer = ref(null);

export let cart = reactive({
	doc: null,

	get loading() {
		return cart_queue.running;
	},

	get promise() {
		return cart_queue.promise || new Promise((resolve) => resolve());
	},

	get customer() {
		return this.doc?.customer || _selected_customer.value;
	},

	get cart_id() {
		return this.doc?.name;
	},

	set_customer(value) {
		if (this.customer != value) {
			return cart_queue.add("set_customer", {
				customer: value,
			});
		}
	},

	// reload_cart() {
	// 	if (this.customer || this.cart_id) {
	// 		return get_cart_resource.fetch({customer: this.customer, cart_id: this.cart_id});
	// 	} else {
	// 		set_cart_doc(null);
	// 	}
	// },

	update_item_qty(item_code, qty, uom=null) {
		if (!this.customer && !this.cart_id) {
			return;
		}
		if (!item_code || qty == null) {
			return;
		}

		return cart_queue.add("update_item_qty", {
			item_code: item_code,
			qty: qty,
			uom: uom,
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	has_item(item_code) {
		return !!this.get_row_by_item(item_code);
	},

	get_row_by_item(item_code) {
		return this.doc?.items?.find(item => item.item_code === item_code);
	}
});

export const cart_queue = reactive({
	running: false,
	promise: null,

	pending_actions: [],
	pending_customer_change: null,

	add(action, params) {
		// Update existing action instead of adding a new one if possible
		let existing_promise = this.update_existing_action(action, params);
		if (existing_promise) {
			return existing_promise;
		}

		// Prepare Action Object
		let action_obj = {
			action: action,
			params: params,
		};

		let promise = new Promise((resolve, reject) => {
			action_obj.resolve = resolve;
			action_obj.reject = reject;
		});

		action_obj.promise = promise;

		// Add to queue
		if (action == "set_customer") {
			this.pending_customer_change = action_obj;
		} else {
			this.pending_actions.push(action_obj);
		}

		// Run the queue if not already running
		if (!this.running) {
			this.promise = this.run();
		}

		return promise;
	},

	update_existing_action(action, params) {
		if (action == "update_item_qty") {
			let existing_action = this.pending_actions.find(q => (
				q.action == "update_item_qty"
				&& q.params.item_code == params.item_code
				&& q.params.customer == params.customer
				&& q.params.cart_id == params.cart_id
			));

			if (existing_action) {
				existing_action.params.qty = params.qty;
				existing_action.params.uom = params.uom;
				return existing_action.promise;
			}
		} else if (action == "set_customer") {
			if (this.pending_customer_change) {
				this.pending_customer_change.params.customer = params.customer;
				return this.pending_customer_change.promise;
			}
		}
	},

	async run() {
		this.running = true;

		while (this.pending_actions.length) {
			let action_obj = this.pending_actions.shift();
			await this.run_action(action_obj);
		}

		if (this.pending_customer_change) {
			let action_obj = this.pending_customer_change;
			this.pending_customer_change = null;

			if (action_obj.params.customer) {
				await this.run_action(action_obj);
			} else {
				set_cart_doc(null);
			}
		}

		this.running = false;
	},

	async run_action(action_obj) {
		try {
			// console.log('Running', action_obj)

			let resource;
			if (action_obj.action == "update_item_qty") {
				resource = update_item_qty_resource;
			} else if (action_obj.action == "set_customer") {
				resource = get_cart_resource;
			}

			action_obj.resolve(await resource.fetch(action_obj.params));
		} catch (e) {
			action_obj.reject(e);
			console.error(e);
		}
	}
});

const get_cart_resource = createResource({
	url: 'portal.api.cart.get_cart',
	method: 'GET',
	makeParams({ customer, cart_id }) {
		return {
			customer: customer || null,
			cart_id: cart_id || null,
		}
	},
	validate(params) {
        validate_cart_id_or_customer(params);
    },
	onSuccess(data) {
		set_cart_doc(data);
	},
});

const update_item_qty_resource = createResource({
	url: 'portal.api.cart.update_item_qty',
	method: 'POST',
	makeParams({ item_code, qty, uom, customer, cart_id }) {
		return {
			item_code: item_code,
			qty: qty,
			uom: uom,
			customer: customer || null,
			cart_id: cart_id || null,
		}
	},
	validate(params) {
        validate_cart_id_or_customer(params);
		if (!params.item_code) {
			return 'Item Code is required';
		}
    },
	onSuccess(data) {
		set_cart_doc(data);
	},
});

const set_cart_doc = (doc) => {
	cart.doc = doc;
	if (!doc) {
		_selected_customer.value = null;
		localStorage.removeItem('last_selected_customer');
	} else if (doc.customer) {
		_selected_customer.value = doc.customer;
		localStorage.setItem('last_selected_customer', doc.customer);
	}
}

const validate_cart_id_or_customer = (params) => {
	if (!params.cart_id && !params.customer) {
		return 'Cart ID or Customer is required';
	}
}
