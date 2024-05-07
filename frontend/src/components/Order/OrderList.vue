<template>
	<ListView
		class="list-view-fix"
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
		show_customers: Boolean,
	},

	methods: {
		get_formatted_value(column, row, value) {
			if (column.key == "grand_total") {
				return format_currency(value, row.currency);
			} else if (column.key == "transaction_date") {
				return format_date(value);
			} else if (column.key == "total_qty") {
				return format_number(value);
			} else {
				return value;
			}
		},
	},

	computed: {
		columns() {
			let columns = [
				{
					label: "Order #",
					key: "name",
					width: "110px",
				},
				{
					label: "Order Date",
					key: "transaction_date",
					width: "100px",
				},
				{
					label: "Customer Name",
					key: "customer_name",
					width: "minmax(150px, 300px)",
				},
				{
					label: "Status",
					key: "status",
					width: "100px",
				},
				{
					label: "Total Qty",
					key: "total_qty",
					align: "right",
					width: "100px",
				},
				{
					label: "Grand Total",
					key: "grand_total",
					align: "right",
					width: "120px",
				},
				{
					label: "Sales Person",
					key: "sales_person",
					width: "minmax(120px, 1fr)",
				},
			];

			if (!this.show_customers) {
				columns = columns.filter(c => c.key != "customer_name")
			}

			return columns;
		},

		options() {
			return {
				selectable: false,
				showTooltip: false,
				rowHeight: 40,
				emptyState: {
					description: 'No orders found',
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