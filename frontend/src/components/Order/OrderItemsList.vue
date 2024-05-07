<template>
	<ListView
		row-key="name"
		class="list-view-fix"
		:columns="columns"
		:rows="doc.items || []"
		:options="options"
		ref="list_view"
	>
		<template #cell="{ column, row, item, align }">
			<OrderRowItem
				:doc="doc"
				:column="column"
				:row="row"
				:value="item"
				:align="align"
				:events="events"
				:read_only="read_only"
				@select-next-row="select_next_row"
				@select-previous-row="select_previous_row"
				@qty-changed="handle_qty_change"
				@value-changed="handle_value_change"
			/>
		</template>
	</ListView>
</template>

<script>
import mitt from 'mitt';
import {ListView} from "frappe-ui";
import QtyField from "@/components/Fields/QtyField.vue";
import OrderRowItem from "@/components/Order/OrderRowItem.vue";

export default {
	name: "OrderItemsList",

	components: {OrderRowItem, QtyField, ListView},

	props: {
		doc: Object,
		read_only: Boolean,
	},

	data() {
		return {
			events: mitt()
		}
	},

	methods: {
		handle_qty_change(row) {
			this.$emit("qty-changed", row);
		},

		handle_value_change(row, field, value) {
			this.$emit("value-changed", row, field, value);
		},

		select_next_row(current_row, field) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.items.length) {
				let row = this.items[current_row_idx + 1];
				this.events.emit("selected", {row, field});
			}
		},

		select_previous_row(current_row, field) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx - 1 >= 0) {
				let row = this.items[current_row_idx - 1];
				this.events.emit("selected", {row, field});
			}
		},

		refresh_view() {
			this.events.emit("refreshed");
		},
	},

	computed: {
		items() {
			return this.doc.items || [];
		},

		columns() {
			return [
				{
					label: "Item",
					key: "item_name",
					width: "minmax(200px, 1fr)",
				},
				{
					label: "Qty",
					key: "qty",
					align: "right",
					width: this.read_only ? "80px" : "140px",
				},
				{
					label: "List Rate",
					key: "price_list_rate",
					align: "right",
					width: "90px",
				},
				{
					label: "Discount",
					key: "discount_percentage",
					align: "right",
					width: "75px",
				},
				{
					label: "Rate",
					key: "rate",
					align: "right",
					width: this.read_only ? "90px" : "110px",
				},
				{
					label: "Amount",
					key: "amount",
					align: "right",
					width: "110px",
				},
			]
		},

		options() {
			return {
				selectable: false,
				showTooltip: false,
				// resizeColumn: true,
				rowHeight: 50,
				emptyState: {
					title: 'No items in order',
				},
			}
		},
	},
}
</script>
