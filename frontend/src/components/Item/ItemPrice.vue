<template>
	<span>{{ text }}</span>
</template>

<script>
import { get_item_prices_resource } from "@/data/items";
import {cart} from "@/data/cart";

export default {
	name: "ItemPrice",

	props: {
		item: Object,
	},

	computed: {
		text() {
			if (this.item_price_resource.loading && !this.price?.price_list_rate) {
				return "..."
			} else if (this.price?.price_list_rate) {
				return format_currency(this.price.price_list_rate, this.currency);
			} else {
				return "";
			}
		},

		currency() {
			return this.item_price_resource.data?.price_list_currency;
		},

		price() {
			if (!this.item_price_resource?.data?.item_prices_map[this.item.name]) {
				return null;
			}
			return this.item_price_resource.data.item_prices_map[this.item.name];
		},

		item_price_resource() {
			return get_item_prices_resource(cart.doc?.customer);
		},
	}
}
</script>
