import {computed, reactive} from "vue";
import { createResource } from "frappe-ui";
import { ref } from 'vue';
import {createAlert} from "@/utils/alerts";
import {subscribe_doc, unsubscribe_doc} from "@/socket";

export const _selected_customer = ref(null);

export const cart = reactive({
	doc: null,
	addresses: [],
	contacts: [],

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

	get modified() {
		return this.doc?.modified;
	},

	get currency() {
		return this.doc?.currency;
	},

	set_customer(value) {
		if (this.customer != value) {
			return cart_queue.add("set_customer", {
				customer: value,
			});
		}
	},

	reload_cart() {
		if (!this.customer && !this.cart_id) {
			return;
		}

		return cart_queue.add("get_cart", {
			customer: this.customer,
			cart_id: this.cart_id
		});
	},

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

	update_item_value(item_code, fieldname, value) {
		if (!this.customer && !this.cart_id) {
			return;
		}
		if (!item_code || !fieldname) {
			return;
		}

		return cart_queue.add("update_item_value", {
			item_code: item_code,
			fieldname: fieldname,
			value: value,
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	update_cart_value(fieldname, value) {
		if (!this.customer && !this.cart_id) {
			return;
		}
		if (!fieldname) {
			return;
		}

		return cart_queue.add("update_cart_value", {
			fieldname: fieldname,
			value: value,
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	clear_cart() {
		if (!this.customer && !this.cart_id) {
			return;
		}

		return cart_queue.add("clear_cart", {
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	reorder_items(sales_order) {
		if (!this.customer && !this.cart_id) {
			return;
		}
		if (!sales_order) {
			return;
		}

		return cart_queue.add("reorder_items", {
			sales_order: sales_order,
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	place_order() {
		if (!this.customer && !this.cart_id) {
			return;
		}

		return cart_queue.add("place_order", {
			cart_id: this.cart_id,
			customer: this.customer,
		});
	},

	has_item(item_code) {
		return !!this.get_row_by_item(item_code);
	},

	get_row_by_item(item_code) {
		return this.doc?.items?.find(item => item.item_code === item_code);
	},

	items_in_queue: computed(() => {
		return cart_queue.pending_actions
			.map(a => a?.params?.item_code)
			.filter(d => d);
	}),
});

export const cart_queue = reactive({
	running: false,
	promise: null,

	running_action: null,
	queued_actions: [],
	queued_get_cart: null,
	queued_place_order: null,

	pending_actions: computed(() => {
		return [
			cart_queue.running_action,
			...cart_queue.queued_actions,
			cart_queue.queued_get_cart,
			cart_queue.queued_place_order,
		].filter(d => d);
	}),

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
		if (["set_customer", "get_cart"].includes(action)) {
			if (this.queued_place_order && action == "set_customer") {
				action_obj.reject("Cannot change customer while placing order");
				return promise;
			}
			this.queued_get_cart = action_obj;
		} else if (action == "place_order") {
			if (
				this.queued_get_cart
				&& this.queued_get_cart.params.customer
				&& this.queued_get_cart.params.customer != cart.doc?.customer
			) {
				action_obj.reject("Cannot place order while changing customer");
				return promise;
			}
			this.queued_place_order = action_obj;
		} else {
			this.queued_actions.push(action_obj);
		}

		// Run the queue if not already running
		if (!this.running) {
			this.promise = this.run();
		}

		return promise;
	},

	update_existing_action(action, params) {
		if (action == "update_item_qty") {
			let existing_action = this.queued_actions.find(q => (
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
		} else if (["set_customer", "get_cart"].includes(action)) {
			if (this.queued_get_cart) {
				if (action == "set_customer") {
					delete this.queued_get_cart.params.cart_id;
					this.queued_get_cart.params.customer = params.customer;
				}
				return this.queued_get_cart.promise;
			}
		} else if (action == "update_cart_value") {
			let existing_action = this.queued_actions.find(q => (
				q.action == "update_cart_value"
				&& q.params.fieldname == params.fieldname
				&& q.params.customer == params.customer
				&& q.params.cart_id == params.cart_id
			));

			if (existing_action) {
				existing_action.params.value = params.value;
				return existing_action.promise;
			}
		} else if (action == "update_item_value") {
			let existing_action = this.queued_actions.find(q => (
				q.action == "update_item_value"
				&& q.params.item_code == params.item_code
				&& q.params.fieldname == params.fieldname
				&& q.params.customer == params.customer
				&& q.params.cart_id == params.cart_id
			));

			if (existing_action) {
				existing_action.params.value = params.value;
				return existing_action.promise;
			}
		} else if (action == "clear_cart") {
			let existing_action = this.queued_actions.find(q => (
				q.action == "clear_cart"
				&& q.params.customer == params.customer
				&& q.params.cart_id == params.cart_id
			));
			if (existing_action) {
				return existing_action.promise;
			}
		} else if (action == "reorder_items") {
			let existing_action = this.queued_actions.find(q => (
				q.action == "reorder_items"
				&& q.params.sales_order == params.sales_order
				&& q.params.customer == params.customer
				&& q.params.cart_id == params.cart_id
			));
			if (existing_action) {
				return existing_action.promise;
			}
		} else if (action == "place_order") {
			if (this.queued_place_order) {
				return this.queued_place_order.promise;
			}
		}
	},

	async run() {
		this.running = true;

		while (this.queued_actions.length) {
			let action_obj = this.queued_actions.shift();
			await this.run_action(action_obj);
		}

		if (this.queued_get_cart) {
			let action_obj = this.queued_get_cart;
			this.queued_get_cart = null;

			if (action_obj.params.customer || action_obj.params.cart_id) {
				await this.run_action(action_obj);
			} else {
				update_cart_data(null);
			}
		}

		if (this.queued_place_order) {
			let action_obj = this.queued_place_order;
			this.queued_place_order = null;
			await this.run_action(action_obj);
		}

		this.running = false;
	},

	async run_action(action_obj) {
		try {
			// console.log('Running', action_obj)
			this.running_action = action_obj;

			let resource;
			if (action_obj.action == "update_item_qty") {
				resource = update_item_qty_resource;
			} else if (["set_customer", "get_cart"].includes(action_obj.action)) {
				resource = get_cart_resource;
			} else if (action_obj.action == "update_cart_value") {
				resource = update_cart_value_resource;
			} else if (action_obj.action == "update_item_value") {
				resource = update_item_value_resource;
			} else if (action_obj.action == "place_order") {
				resource = place_order_resource;
			} else if (action_obj.action == "clear_cart") {
				resource = clear_cart_resource;
			} else if (action_obj.action == "reorder_items") {
				resource = reorder_items_resource;
			}

			if (!resource) {
				throw new Error("Invalid action");
			}

			let data = await resource.fetch(action_obj.params);
			update_cart_data(data);
			action_obj.resolve(data);
		} catch (e) {
			action_obj.reject(e);
			createAlert({"title": "Error Updating Cart", "message": e, "variant": "error"});
		} finally {
			this.running_action = null;
		}
	}
});

const get_cart_resource = createResource({
	url: 'portal.sales_portal.api.cart.get_cart',
	method: 'GET',
	makeParams({ customer, cart_id }) {
		let params = {};

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
	},
});

const update_item_qty_resource = createResource({
	url: 'portal.sales_portal.api.cart.update_item_qty',
	method: 'POST',
	makeParams({ item_code, qty, uom, customer, cart_id }) {
		let params = {
			item_code: item_code,
			qty: qty,
			uom: uom,
		}

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
		if (!params.item_code) {
			return 'Item Code is required';
		}
	},
});

const update_cart_value_resource = createResource({
	url: 'portal.sales_portal.api.cart.update_cart_value',
	method: 'POST',
	makeParams({ fieldname, value, customer, cart_id }) {
		let params = {
			fieldname: fieldname,
			value: value,
		}

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
		if (!params.fieldname) {
			return 'Fieldname is required';
		}
	},
});

const update_item_value_resource = createResource({
	url: 'portal.sales_portal.api.cart.update_item_value',
	method: 'POST',
	makeParams({ item_code, fieldname, value, customer, cart_id }) {
		let params = {
			item_code: item_code,
			fieldname: fieldname,
			value: value,
		}

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
		if (!params.item_code) {
			return 'Item Code is required';
		}
		if (!params.fieldname) {
			return 'Fieldname is required';
		}
	},
});

const clear_cart_resource = createResource({
	url: 'portal.sales_portal.api.cart.clear_cart',
	method: 'POST',
	makeParams({ customer, cart_id }) {
		let params = {};

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
	},
	onSuccess(data) {
		createAlert({"title": "Order Cart Cleared", "message": `Items cleared`, "variant": "info"});
	}
});

const place_order_resource = createResource({
	url: 'portal.sales_portal.api.cart.place_order',
	method: 'POST',
	makeParams({ customer, cart_id }) {
		let params = {};

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
	},
	onSuccess(data) {
		createAlert({"title": "Order Placed", "message": `Order ${data.sales_order} placed successfully`, "variant": "success"});
	}
});

const reorder_items_resource = createResource({
	url: 'portal.sales_portal.api.cart.reorder_items',
	method: 'POST',
	makeParams({ sales_order, customer, cart_id }) {
		let params = {
			sales_order: sales_order
		};

		if (customer) {
			params.customer = customer;
		}
		if (cart_id) {
			params.cart_id = cart_id;
		}

		return params;
	},
	validate(params) {
		validate_cart_id_or_customer(params);
		if (!params.sales_order) {
			return 'Sales Order # is required';
		}
	},
	onSuccess(data) {
		if (cint(data.no_of_items_added) > 0) {
			createAlert({
				"title": "Reordered Items",
				"message": `<b>${data.no_of_items_added}</b> Items added to cart from Order ${data.sales_order}`,
				"variant": "success"
			});
		} else {
			createAlert({
				"title": "Items Already Added",
				"message": `All Items from Order ${data.sales_order} are already added to cart`,
				"variant": "info"
			});
		}
	}
});

const update_cart_data = (data) => {
	let previous_doc = cart.doc;

	cart.doc = data?.doc;
	cart.addresses = data?.addresses || [];
	cart.contacts = data?.contacts || [];

	if (!cart.doc) {
		_selected_customer.value = null;
		localStorage.removeItem('last_selected_customer');
	} else if (cart.doc.customer) {
		_selected_customer.value = cart.doc.customer;
		localStorage.setItem('last_selected_customer', cart.doc.customer);
	}

	subscribe_cart_doc(cart.doc, previous_doc);
}

export const setup_cart_realtime = () => {
	$socket.on("doc_update", (data) => {
		// Do not reload if queue is running
		if (cart_queue.running) {
			return;
		}

		// Ignore if cart id is not the same
		if (!cart.cart_id || data.doctype != 'Cart' || data.name != cart.cart_id) {
			return;
		}

		// Do not reload if we have the same version
		if (data.modified == cart.doc?.modified) {
			return;
		}

		cart.reload_cart();
	})
}

const subscribe_cart_doc = (new_doc, previous_doc) => {
	// Unsubscribe if cart changed
	if (previous_doc?.name && previous_doc.name != new_doc?.name) {
		unsubscribe_doc($socket, "Cart", previous_doc.name);
	}

	// Subscribe to new cart
	if (new_doc?.name) {
		subscribe_doc($socket, "Cart", new_doc.name);
	}
}

const validate_cart_id_or_customer = (params) => {
	if (!params.cart_id && !params.customer) {
		return 'Cart ID or Customer is required';
	}
}
