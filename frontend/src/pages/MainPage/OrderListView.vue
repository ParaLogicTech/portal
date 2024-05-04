<template>
	<div class="p-2">
		<OrderList
			:rows="rows"
			ref="orders"
		/>
	</div>
</template>

<script>
import OrderList from "@/components/Order/OrderList.vue";
import {on_doctype_list_update, unsubscribe_doc} from "@/socket";
import {createAlert} from "@/utils/alerts";

export default {
	name: "OrderListView",

	components: {OrderList},

	methods: {
		async reload() {
			try {
				await this.list_resource.fetch();
			} catch (e) {
				createAlert({"title": "Error loading Sales Order", "message": e, "variant": "error"});
			}
		},
	},

	computed: {
		rows() {
			return this.list_resource.data || [];
		},

		list_resource() {
			return this.$resources.order_list;
		},
	},

	activated() {
		this.reload();
		// on_doctype_list_update($socket, "Sales Order", (name) => {
		// 	if (this.list_resource.originalData?.find((d) => d.name === name)) {
		// 		this.list_resource.fetchOne.submit(name)
		// 	}
		// })
	},

	deactivated() {
		// unsubscribe_doc($socket, 'Sales Order', this.name);
		// $socket.off("doc_update", this.handle_realtime_update);
	},

	resources: {
		order_list: {
			type: 'list',
			doctype: 'Sales Order',
			method: 'GET',
			filters: {
				docstatus: ["<", 2],
			},
			// url: 'portal.sales_portal.api.orders.order.list',
			fields: [
				'name',
				'transaction_date',
				'delivery_date',
				'customer',
				'customer_name',
				'grand_total',
				'delivery_status',
				'currency',
				'status',
			],
			orderBy: 'transaction_date',
		},
	},
}
</script>
