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
			if (standard_prices.loading) {
				return "..."
			} else if (standard_prices.fetched) {
				if (this.item.standard_price?.price_list_rate) {
					return this.item.standard_price.formatted_price_list_rate;
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
	}
}
</script>
