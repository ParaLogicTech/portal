<template>
	<div class="rounded-sm py-0.5 px-1" :class="classes">
		{{ text }}
	</div>
</template>

<script>
import { item_stock } from "@/data/items";

export default {
	name: "ItemStock",

	props: {
		item: Object,
	},

	computed: {
		text() {
			if (item_stock.loading) {
				return `Loading...`;
			} else if (item_stock.fetched) {
				let stock_data = this.stock_data;
				if (stock_data?.actual_qty > 0) {
					return `In Stock: ${stock_data.actual_qty} ${stock_data.uom}`;
				} else {
					return "Out of Stock"
				}
			} else {
				return ""
			}
		},

		classes() {
			if (item_stock.loading) {
				return ['text-gray-600', 'bg-gray-100'];
			} else if (item_stock.fetched) {
				let stock_data = this.stock_data;
				if (stock_data?.actual_qty > 0) {
					return ['text-green-800', 'bg-green-200'];
				} else {
					return ['text-red-800', 'bg-red-200'];
				}
			} else {
				return []
			}
		},

		stock_data() {
			if (!item_stock.data) {
				return null;
			}

			return item_stock.data[this.item.name];
		}
	}
}
</script>
