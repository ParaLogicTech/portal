<template>
	<div class="flex flex-col h-full">
		<OrderFilters
			v-model:filters="filters"
			:loading="list_resource.list.loading"
			class="flex-none border-b border-gray-400 shadow-sm"
			@update:filters="handle_filter_change"
			@reload="reload"
		/>

		<div class="overflow-y-auto">
			<OrderList
				:rows="rows_to_show"
				:has_more="has_more"
				:show_customers="!customer"
				:loading="list_resource.list.loading"
				ref="orders"
				@load-more="handle_load_more"
				class="p-1.5"
			/>
		</div>
	</div>
</template>

<script>
import OrderList from "@/components/Order/OrderList.vue";
import {subscribe_doctype} from "@/socket";
import {createAlert} from "@/utils/alerts";
import {cart, _selected_customer} from "@/data/cart";
import OrderFilters from "@/components/Order/OrderFilters.vue";
import debounce from "frappe-ui/src/utils/debounce";

const initial_page_length = 20;

export default {
	name: "OrderListView",

	components: {OrderFilters, OrderList},

	data() {
		return {
			filters: {
				name: null,
				sales_person: null,
			},
			page_length: initial_page_length,
			debounced_reload: debounce(this.reload, 250),
		}
	},

	methods: {
		handle_filter_change() {
			this.list_resource.pageLength = initial_page_length + 1;
			this.debounced_reload();
		},

		async reload() {
			if (this.list_resource.list.loading) {
				return;
			}

			try {
				this.set_resource_filters();
				await this.list_resource.reload();
				this.page_length = this.list_resource.pageLength - 1;
			} catch (e) {
				createAlert({"title": "Error loading Sales Orders", "message": e, "variant": "error"});
			}
		},

		set_resource_filters() {
			this.list_resource.filters = [
				["Sales Order", "docstatus", "<", 2],
			];

			if (this.customer) {
				this.list_resource.filters.push(["Sales Order", "customer", "=", this.customer]);
			}

			if (this.filters.name) {
				this.list_resource.filters.push(["Sales Order", "name", "like", '%' + this.filters.name + '%']);
			}
			if (this.filters.sales_person?.value) {
				this.list_resource.filters.push(["Sales Team", "sales_person", "subtree of", this.filters.sales_person.value]);
			}
		},

		handle_realtime_update(data) {
			if (data.doctype != "Sales Order") {
				return;
			}
			this.debounced_reload();
		},

		handle_load_more() {
			this.list_resource.pageLength += initial_page_length;
			this.reload();
		},
	},

	computed: {
		rows() {
			return this.list_resource.data || [];
		},

		rows_to_show() {
			return this.rows.slice(0, this.page_length);
		},

		has_more() {
			return this.rows.length > this.page_length;
		},

		customer() {
			return _selected_customer.value || cart.customer;
		},

		list_resource() {
			return this.$resources.order_list;
		},
	},

	activated() {
		this.reload();
		subscribe_doctype($socket, "Sales Order");
		$socket.on('list_update', this.handle_realtime_update);
	},

	deactivated() {
		$socket.off('list_update', this.handle_realtime_update);
	},

	resources: {
		order_list: {
			type: 'list',
			url: 'portal.sales_portal.api.orders.get_sales_order_list',
			doctype: 'Sales Order',
			method: 'GET',
			fields: [
				'name',
				'transaction_date',
				'delivery_date',
				'customer',
				'customer_name',
				'total_qty',
				'grand_total',
				'delivery_status',
				'currency',
				'status',
				'docstatus',
			],
			orderBy: 'transaction_date desc, name desc',
			groupBy: 'name',
			pageLength: initial_page_length + 1,
		},
	},

	watch: {
		customer() {
			this.handle_filter_change();
		}
	}
}
</script>
