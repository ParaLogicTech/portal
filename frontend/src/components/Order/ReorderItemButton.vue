<template>
	<Button
		variant="subtle"
		theme="gray"
		size="sm"
		:title="reorder_already_in_cart ? 'Already in Cart' : 'Reorder'"
		:disabled="reorder_already_in_cart"
		:loading="reorder_loading"
		@click="reorder_item"
	>
		<Check v-if="reorder_already_in_cart" class="h-[14px] w-[14px]" stroke-width="1.8px"/>
		<Spinner v-else-if="reorder_loading" class="h-[14px] w-[14px]" />
		<ShoppingBag v-else class="h-[14px] w-[14px]" stroke-width="2px" />
	</Button>
</template>

<script>
import {Button, Spinner} from "frappe-ui";
import {Check, ShoppingBag} from "lucide-vue-next";
import {alert_select_customer, cart} from "@/data/cart";
import {createAlert} from "@/utils/alerts";

export default {
	name: "ReorderItemButton",

	components: {Check, Button, ShoppingBag, Spinner},

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		reorder_loading() {
			return (
				!this.reorder_already_in_cart
				&& this.is_in_cart_queue
			);
		},

		reorder_already_in_cart() {
			return cart.has_item(this.item.name);
		},

		is_in_cart_queue() {
			return !!cart.items_in_queue.find(item_code => item_code == this.item.name);
		},
	},

	methods: {
		async reorder_item() {
			if (this.reorder_already_in_cart || this.is_in_cart_queue) {
				return;
			}

			if (!cart.customer_or_cart_selected()) {
				alert_select_customer(true);
				return;
			}

			await cart.update_item_qty(this.item.name, 1);

			createAlert({
				title: "Reordered Item",
				message: `Added <b>1 ${this.item.uom}</b> of <b>${this.item.item_name}</b> to Cart`,
				variant: "success",
			});
		},
	},
}
</script>
