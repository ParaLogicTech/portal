<template>
	<ListView
		class="list-view-fix"
		row-key="name"
		:columns="columns"
		:rows="rows || []"
		:options="options"
	>
		<ListHeader/>

		<ListRows v-if="rows?.length">
			<ListRow
				v-for="row in rows"
				:class="{'highlighted-customer': row.name === highlighted_customer}"
				:row="row"
				v-slot="{column, item, align}"
				:data-customer="row.name"
			>
				<ListRowItem
					:class="get_text_color(row)"
					:column="column"
					:row="row"
					:item="item"
					:align=align
				>
					<template #prefix v-if="column.key == 'customer_name'">
						<CircleX
							v-if="!row.name"
							class="h-[16px] w-[16px]"
							stroke-width="1.7px"
						/>
						<CircleCheckBig
							v-else-if="is_selected_customer(row)"
							class="h-[15px] w-[15px]"
							stroke-width="1.7px"
						/>
					</template>

					<template #default v-if="column.key == 'customer_name'">
						<div class="truncate text-base">
							{{ row.name ? row.customer_name || row.name : 'Deselect Customer' }}
						</div>
					</template>
				</ListRowItem>
			</ListRow>
		</ListRows>
		<ListEmptyState v-else/>
	</ListView>
</template>

<script>
import {ListView, ListRowItem, ListHeader, ListRows, ListRow, ListEmptyState} from "frappe-ui"
import {settings} from "@/data/settings";
import {CircleCheckBig, CircleX} from "lucide-vue-next";
import {cart} from "@/data/cart";

export default {
	name: "CustomerList",

	components: {
		ListView,
		ListHeader,
		ListRows,
		ListRow,
		ListRowItem,
		ListEmptyState,
		CircleCheckBig,
		CircleX,
	},

	props: {
		rows: Array,
		loading: Boolean,
		highlighted: null,
	},

	data() {
		return {
			highlighted_customer: null,
		}
	},

	computed: {
		columns() {
			let columns = [
				{
					label: "Customer ID",
					key: "name",
					width: "100px",
				},
				{
					label: "Customer Name",
					key: "customer_name",
					width: "minmax(200px, 300px)",
				},
				{
					label: "Address",
					key: "address_display_short",
				},
			];

			if (!this.show_customer_id) {
				columns = columns.filter(c => c.key != "name")
			}

			return columns;
		},

		options() {
			return {
				selectable: false,
				showTooltip: false,
				onRowClick: (row) => this.select_customer(row.name),
				emptyState: {
					description: 'No customers found',
				},
			}
		},

		show_customer_id() {
			return settings.value.customer_naming_by != "Customer Name";
		},

		selected_customer() {
			return cart.selected_customer;
		},

		rows_without_empty() {
			return this.rows.filter(d => d?.name);
		},
	},

	methods: {
		highlight_next_customer() {
			let rows = this.rows_without_empty;

			let highlighted_idx = this.get_highlighted_idx();
			let next_idx = highlighted_idx;
			if (rows.length > highlighted_idx + 1) {
				next_idx += 1;
			}

			if (next_idx != -1) {
				this.set_highlighted_customer(rows[next_idx]?.name);
			}
		},

		highlight_previous_customer() {
			let rows = this.rows_without_empty;

			let highlighted_idx = this.get_highlighted_idx();
			let previous_idx = highlighted_idx;
			if (highlighted_idx >= 0) {
				previous_idx -= 1;
			}

			if (previous_idx != -1) {
				this.set_highlighted_customer(rows[previous_idx]?.name);
			}
		},

		get_highlighted_idx() {
			let rows = this.rows_without_empty;
			let highlighted_idx = -1;
			if (this.highlighted_customer) {
				highlighted_idx = rows.findIndex(d => d.name === this.highlighted_customer);
			}

			return highlighted_idx;
		},

		set_highlighted_customer(customer) {
			this.highlighted_customer = customer || null;

			if (this.highlighted_customer) {
				let row_el = this.$el.querySelector(`[data-customer="${this.highlighted_customer}"]`);
				if (row_el) {
					row_el.scrollIntoView({behavior: "instant", block: "nearest"});
				}
			}
		},

		select_highlighted_customer() {
			if (this.highlighted_customer) {
				this.select_customer(this.highlighted_customer);
			}
		},

		select_customer(customer) {
			this.$emit("customer-selected", customer || null);
		},

		get_text_color(row) {
			if (!row.name) {
				return 'text-gray-500';
			}
			if (this.is_selected_customer(row)) {
				return 'text-violet-800';
			}
		},

		is_selected_customer(row) {
			return this.selected_customer && row?.name && row.name == this.selected_customer
		},
	},

	watch: {
		rows() {
			this.set_highlighted_customer(null);
		}
	},
}
</script>

<style lang="scss">
.highlighted-customer {
	@apply bg-yellow-100;
}
</style>