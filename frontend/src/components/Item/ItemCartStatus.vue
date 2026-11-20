<template>
	<div
		v-if="is_in_cart"
		class="text-blue-900 bg-blue-200 p-1 text-xs border border-blue-400 rounded"
	>
		<Check class="h-3.5 w-3.5 mr-1 inline" stroke-width="1.8px"/>
		<span>In Cart</span>
		<span v-if="!hide_qty">: {{ cart_qty }} {{ cart_uom || "" }}</span>
	</div>
</template>

<script>
import {Check} from "lucide-vue-next";
import {cart} from "@/data/cart";

export default {
	name: "ItemCartStatus",

	components: { Check },

	props: {
		item: {
			type: Object,
			required: true,
		},
		hide_qty: Boolean,
	},

	computed: {
		cart_qty() {
			let rows = cart.get_rows_by_item(this.item.name) || [];
			let qty = 0;
			for (let row of rows) {
				if (this.use_stock_qty) {
					qty += flt(row.stock_qty);
				} else {
					qty += flt(row.qty);
				}
			}
			return format_number(qty);
		},

		cart_uom() {
			if (this.use_stock_qty) {
				return cart.get_row_by_item(this.item.name)?.stock_uom;
			} else {
				return cart.get_row_by_item(this.item.name)?.uom;
			}
		},

		use_stock_qty() {
			let rows = cart.get_rows_by_item(this.item.name) || [];
			let uoms = [...new Set(rows.map(row => row.uom))];
			return uoms.length > 1;
		},

		is_in_cart() {
			return cart.has_item(this.item.name);
		},
	}
}
</script>
