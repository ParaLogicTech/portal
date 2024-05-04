<template>
	<ListView
		row-key="name"
		:columns="columns"
		:rows="rows || []"
		:options="options"
		ref="list_view"
	>
		<template #cell="{ column, row, item, align }">
			<OrderStatusBadge
				v-if="column.key == 'status'"
				:doc="row"
				class="w-fit"
			/>
			<ListRowItem
				v-else
				:column="column"
				:row="row"
				:item="get_formatted_value(column, row, item)"
				:align="align"
			/>
		</template>
	</ListView>
</template>

<script>
import {ListView, ListRowItem} from "frappe-ui"
import OrderStatusBadge from "@/components/Order/OrderStatusBadge.vue";

export default {
	name: "OrderList",

	components: {OrderStatusBadge, ListView, ListRowItem},

	props: {
		rows: Array,
	},

	methods: {
		get_formatted_value(column, row, value) {
			if (column.key == "grand_total") {
				return format_currency(value, row.currency);
			} else if (column.key == "transaction_date") {
				return format_date(value);
			} else {
				return value;
			}
		},
	},

	computed: {
		columns() {
			return [
				{
					label: "Order #",
					key: "name",
					width: "100px",
				},
				{
					label: "Order Date",
					key: "transaction_date",
					width: "140px",
				},
				{
					label: "Status",
					key: "status",
					width: "140px",
				},
				{
					label: "Grand Total",
					key: "grand_total",
					align: "right",
					width: "100px",
				},
			]
		},

		options() {
			return {
				selectable: false,
				showTooltip: false,
				rowHeight: 40,
				emptyState: {
					title: 'No orders found',
				},
				getRowRoute: (row) => {
					return {
						name: "OrderView",
						params: {name: row.name},
					}
				}
			}
		},
	},
}
</script>