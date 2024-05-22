<template>
	<div class="flex flex-col h-full">
		<CartHeader
			class="top-bar-height px-3 py-1 border-b border-gray-400 shadow-sm"
			@clear-cart="handle_clear_cart"
			@reload-cart="handle_reload_cart"
		/>

		<div class="overflow-y-auto h-full">
			<OrderForm
				v-model:doc="model"
				:addresses="addresses"
				:contacts="contacts"
				:loading="placing_order"
				@qty-changed="handle_qty_change"
				@item-removed="handle_item_removed"
				@cart-value-changed="handle_cart_value_change"
				@item-value-changed="handle_item_value_change"
				ref="order_form"
			/>

			<div class="top-bar-height flex justify-end items-center px-3 py-1 border-t border-gray-400">
				<Button
					variant="solid"
					theme="blue"
					size="sm"
					label="Submit Order"
					:disabled="!can_submit"
					:link="null"
					:loading="confirmation_dialog || placing_order"
					@click="confirmation_dialog = true"
					class="h-[30px]"
				>
					<template #suffix>
						<SendHorizontal class="h-4" />
					</template>
				</Button>
			</div>
		</div>

		<Dialog
			v-model="confirmation_dialog"
			:options="{
				title: 'Confirm',
				message: 'Are you sure you want to submit this order?',
				size: 'xl',
				actions: [
					{
						label: 'Confirm',
						variant: 'solid',
						theme: 'blue',
						onClick: () => {
							this.place_order();
						},
					},
				],
			}"
		/>
	</div>
</template>

<script>
import CartHeader from "@/components/Cart/CartHeader.vue";
import {cart} from "@/data/cart";
import OrderForm from "@/components/Order/OrderForm.vue";
import {Button} from "frappe-ui";
import {SendHorizontal} from "lucide-vue-next"
import CartController from "@/mixins/CartController";

export default {
	name: "CartView",

	mixins: [CartController],

	components: {OrderForm, CartHeader, Button, SendHorizontal},

	data() {
		return {
			placing_order: false,
			confirmation_dialog: false,
		}
	},

	methods: {
		refresh_view() {
			this.refresh_cart_model();
			this.$nextTick(() => {
				this.$refs.order_form.refresh_view();
			});
		},

		async place_order() {
			this.confirmation_dialog = false;
			if (this.can_submit) {
				try {
					this.placing_order = true;
					let data = await cart.place_order();
					if (data.sales_order) {
						this.$router.push({
							name: "OrderView",
							params: {
								name: data.sales_order
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
		addresses() {
			return cart.addresses || [];
		},

		contacts() {
			return cart.contacts || [];
		},
	},
}
</script>
