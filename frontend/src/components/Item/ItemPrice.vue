<template>
	<span>{{ text }}</span>
</template>

<script>
import { standard_prices, get_item_prices_resource } from "@/data/items";
import {cart} from "@/data/cart";

export default {
	name: "ItemPrice",

	props: {
		item: Object,
	},

	computed: {
		text() {
			if (standard_prices.loading && !this.price?.price_list_rate) {
				return "..."
			} else if (this.price?.price_list_rate) {
				return format_currency(this.price.price_list_rate, this.currency);
			} else {
				return "";
			}
		},

		currency() {
			return standard_prices.data?.price_list_currency;
		},

		price() {
			const item_price_resource = get_item_prices_resource(cart.doc?.customer);
			if(item_price_resource.data) {
				if(item_price_resource.data.item_prices_map[this.item.name]) {
					return item_price_resource.data.item_prices_map[this.item.name]
				}
			}
		}
	}
}
</script>
