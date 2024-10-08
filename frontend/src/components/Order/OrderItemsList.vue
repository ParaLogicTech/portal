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
				:read_only="read_only"
				@select-next-row="select_next_row"
				@select-previous-row="select_previous_row"
				@qty-changed="handle_qty_change"
				@value-changed="handle_value_change"
				:ref="collect_item_cell_refs"
			/>
		</template>
	</ListView>
</template>

<script>
import {ListView} from "frappe-ui";
import QtyField from "@/components/Fields/QtyField.vue";
import OrderRowItem from "@/components/Order/OrderRowItem.vue";
import SelectableItems from "@/mixins/SelectableItems";
import {settings} from "@/data/settings";

export default {
	name: "OrderItemsList",

	components: {OrderRowItem, QtyField, ListView},

	mixins: [SelectableItems],

	props: {
		doc: Object,
		read_only: Boolean,
	},

	data() {
		return {
			item_cell_refs: [],
		}
	},

	methods: {
		select_item(item_code) {
			this.select_row(this.get_row_by_item_code(item_code), "qty", true);
		},

		select_next_row(current_row, field) {
			this.select_row(this.get_next_row(current_row), field);
		},

		select_previous_row(current_row, field) {
			this.select_row(this.get_previous_row(current_row), field);
		},

		select_row(row, field="qty", center=false) {
			if (row) {
				(this.item_cell_refs || []).find(d => d.row == row && d.column.key == field)?.focus_field(field, center);
			}
		},

		handle_qty_change(row) {
			this.$emit("qty-changed", row);
		},

		handle_value_change(row, field, value) {
			this.$emit("value-changed", row, field, value);
		},

		refresh_view() {
			for (let d of this.item_cell_refs || []) {
				d.refresh_view();
			}
		},

		collect_item_cell_refs(el) {
			if (el) {
				this.item_cell_refs.push(el);
			}
		},
	},

	computed: {
		items() {
			return this.doc?.items || [];
		},

		columns() {
			let columns = [
				{
					label: "#",
					key: "idx",
					width: "8px",
				},
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
				{
					key: "actions",
					align: "center",
					width: "50px",
				},
			];

			if (!settings.value.is_system_user) {
				columns = columns.filter(c => !['price_list_rate', 'discount_percentage'].includes(c.key));
			}
			if (this.doc.doctype != "Sales Order") {
				columns = columns.filter(c => !['actions'].includes(c.key));
			}

			return columns;
		},

		options() {
			let options = {
				selectable: false,
				showTooltip: false,
				// resizeColumn: true,
				rowHeight: 50,
				emptyState: {
					description: 'Order is empty',
				},
			};

			if (!this.read_only) {
				options.emptyState.button = {
					label: 'Explore Items',
					variant: 'subtle',
					onClick: () => this.$router.push({name: 'ItemListView'}),
				};
			}

			return options;
		},
	},

	beforeUpdate() {
		this.item_cell_refs = [];
	}
}
</script>
