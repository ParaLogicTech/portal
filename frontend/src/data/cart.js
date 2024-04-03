import { reactive } from "vue";
import { createResource } from "frappe-ui";
import { ref } from 'vue';

export let _selected_customer = ref(null);

export let cart = reactive({
	doc: null,

	get customer() {
		return _selected_customer.value;
	},

	get cart_id() {
		return this.doc?.name;
	},

	set_customer(value) {
		if (this.customer != value) {
			_selected_customer.value = value;
			this.get_customer_cart();
		}
	},

	get_customer_cart() {
		if (this.customer) {
			return get_cart_resource.fetch({customer: this.customer});
		} else {
			set_cart_doc(null);
		}
	},

	reload_cart() {
		if (this.customer || this.cart_id) {
			return get_cart_resource.fetch({customer: this.customer, cart_id: this.cart_id});
		} else {
			set_cart_doc(null);
		}
	},

	update_item_qty(item_code, qty, uom=null) {
		if (!this.customer && !this.cart_id) {
			return;
		}
		if (!item_code || qty == null) {
			return;
		}

		return update_item_qty_resource.fetch({
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
	}
});

export const get_cart_resource = createResource({
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

export const update_item_qty_resource = createResource({
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
