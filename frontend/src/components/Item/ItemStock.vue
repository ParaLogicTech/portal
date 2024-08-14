<template>
	<div>
		<div
			class="rounded-sm py-0.5 px-1"
			:class="classes"
			v-if="show_availability"
		>
			{{ text }}
		</div>
	</div>
</template>

<script>
import { item_stock } from "@/data/items";
import {settings} from "@/data/settings";

export default {
	name: "ItemStock",

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		text() {
			if (item_stock.loading) {
				return `Loading...`;
			}

			if (!item_stock.fetched) {
				return "";
			}

			if (flt(this.available_qty, 2) > 0) {
				if (this.show_qty) {
					return `Available: ${format_number(this.available_qty, null, 1)} ${this.stock_data?.uom || ""}`;
				} else {
					return "Available";
				}
			} else {
				return "Out of Stock"
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

		available_qty() {
			if (settings.value.stock_availability_based_on == "Projected Qty") {
				return flt(this.stock_data?.projected_qty);
			} else {
				return flt(this.stock_data?.actual_qty);
			}
		},

		show_qty() {
			return settings.value.show_stock_availability == "Show Availability with Qty" && this.show_availability;
		},

		show_availability() {
			return settings.value.show_stock_availability != "Hide Stock Availability";
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
