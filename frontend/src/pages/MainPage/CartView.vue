<template>
	<div class="flex flex-col h-full">
		<CartHeader class="top-bar-height px-3 py-1 border-b border-gray-400 shadow-sm"/>

		<OrderForm
			class="h-full overflow-y-auto"
			v-model:doc="model"
			:addresses="addresses"
			:contacts="contacts"
			@qty-changed="handle_qty_change"
			@cart-value-changed="handle_cart_value_change"
			@item-value-changed="handle_item_value_change"
			ref="cart_form"
		/>

		<div class="top-bar-height flex justify-end items-center px-3 py-1 border-t border-gray-400 shadow-sm">
			<Button
				variant="solid"
				theme="blue"
				size="sm"
				label="Submit Order"
				:disabled="!can_submit"
				:link="null"
				:loading="placing_order"
				@click="place_order"
				class="min-w-18"
			>
				<template #suffix>
					<SendHorizontal class="h-4" />
				</template>
			</Button>
		</div>
	</div>
</template>

<script>
import CartHeader from "@/components/Cart/CartHeader.vue";
import {cart} from "@/data/cart";
import OrderForm from "@/components/Order/OrderForm.vue";
import {Button} from "frappe-ui";
import cloneDeep from "lodash.clonedeep"
import {SendHorizontal} from "lucide-vue-next"

export default {
	name: "CartView",

	components: {OrderForm, CartHeader, Button, SendHorizontal},

	data() {
		return {
			cart: cart,
			model: this.make_cart_model(),
			placing_order: false,
		}
	},

	methods: {
		handle_qty_change(row) {
			cart.update_item_qty(row.item_code, row.qty, row.uom);
		},

		handle_cart_value_change(field, value) {
			cart.update_cart_value(field, value);
		},

		handle_item_value_change(row, field, value) {
			cart.update_item_value(row.item_code, field, value)
		},

		refresh_form() {
			this.model = this.make_cart_model();
			this.$nextTick(() => {
				this.$refs.cart_form.refresh_view();
			});
		},

		make_cart_model() {
			return cloneDeep(cart.doc || {});
		},

		async place_order() {
			if (this.can_submit) {
				try {
					this.placing_order = true;
					let data = await cart.place_order();
					if (data.sales_order) {
						this.$router.push({
							name: "SalesOrderView",
							params: {
								id: data.sales_order
							}
						});
					}
				} finally {
					this.placing_order = false;
				}
			}
		},
	},

	computed: {
		can_submit() {
			return (
				this.doc.customer
				&& (this.doc.items || []).length
			)
		},

		addresses() {
			return cart.addresses || [];
		},

		contacts() {
			return cart.contacts || [];
		},

		doc() {
			return cart.doc || {};
		},
	},

	created() {
		this.$watch(() => cart.loading, () => {
			if (!cart.loading) {
				this.refresh_form();
			}
		});
	}
}
</script>