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
				:rows="rows"
				:show_customers="!this.customer"
				ref="orders"
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

export default {
	name: "OrderListView",

	components: {OrderFilters, OrderList},

	data() {
		return {
			filters: {
				name: null,
				sales_person: null,
			},
			debounced_reload: debounce(this.reload, 250),
		}
	},

	methods: {
		handle_filter_change() {
			this.debounced_reload();
		},

		async reload() {
			if (this.list_resource.list.loading) {
				return;
			}

			try {
				this.set_resource_filters();
				await this.list_resource.fetch();
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
	},

	computed: {
		rows() {
			return this.list_resource.data || [];
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
		},
	},

	watch: {
		customer() {
			this.debounced_reload();
		}
	}
}
</script>
