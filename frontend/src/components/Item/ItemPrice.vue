<template>
	<span>{{ text }}</span>
</template>

<script>
import { standard_prices } from "@/data/items";

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
			if (!standard_prices.data) {
				return null;
			}

			return standard_prices.data.item_prices_map[this.item.name];
		}
	}
}
</script>
