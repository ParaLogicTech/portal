import cloneDeep from "lodash.clonedeep";
import {cart} from "@/data/cart";

const CartController = {
	data() {
		return {
			model: this.make_cart_model(),
		}
	},

	computed: {
		cart_doc() {
			return cart.doc || {};
		},

		can_submit() {
			return (
				this.cart_doc.customer
				&& (this.cart_doc.items || []).length
			)
		},
	},

	methods: {
		refresh_view() {
			this.refresh_cart_model();
		},

		refresh_cart_model() {
			this.model = this.make_cart_model();
		},

		make_cart_model() {
			return cloneDeep(cart.doc || {});
		},

		handle_qty_change(row) {
			cart.update_item_qty(row.item_code, row.qty, row.uom);
		},

		handle_item_removed(row) {
			cart.update_item_qty(row.item_code, 0);
		},

		handle_cart_value_change(field, value) {
			cart.update_cart_value(field, value);
		},

		handle_item_value_change(row, field, value) {
			cart.update_item_value(row.item_code, field, value)
		},

		handle_clear_cart() {
			cart.clear_cart();
		},

		handle_reload_cart() {
			cart.reload_cart();
		},
	},

	created() {
		this.$watch(() => cart.loading, () => {
			if (!cart.loading) {
				this.refresh_view();
			}
		});

		this.$watch(() => cart.customer, () => {
			this.refresh_view();
		});
	},

	activated() {
		this.refresh_view();
	},
}

export default CartController;
