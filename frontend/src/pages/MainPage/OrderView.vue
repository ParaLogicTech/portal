<template>
	<div class="flex flex-col h-full">
		<OrderHeader
			class="top-bar-height px-3 py-1 border-b border-gray-400 shadow-sm"
			:name="name"
			:doc="doc"
			:loading="loading"
			@reload="reload"
		/>

		<OrderForm
			class="h-full overflow-y-auto"
			ref="order_form"
			v-model:doc="doc"
			:addresses="addresses"
			:contacts="contacts"
			:read_only="true"
			:loading="order_resource.loading"
		/>
	</div>
</template>

<script>
import OrderForm from "@/components/Order/OrderForm.vue";
import OrderHeader from "@/components/Order/OrderHeader.vue";
import {createAlert} from "@/utils/alerts";
import {subscribe_doc, unsubscribe_doc} from "@/socket";

export default {
	name: "OrderView",

	components: {OrderHeader, OrderForm},

	props: {
		name: {
			type: String,
			required: true,
		}
	},

	data() {
		return {
			active: false,
		}
	},

	methods: {
		async reload() {
			try {
				await this.order_resource.fetch();
			} catch (e) {
				createAlert({"title": "Error Loading Sales Order", "message": e, "variant": "error"});
			}
			this.refresh_view();
		},

		refresh_view() {
			this.$nextTick(() => {
				this.$refs.order_form.refresh_view();
			});
		},

		setup_realtime_updates() {
			subscribe_doc($socket, 'Sales Order', this.name);
			$socket.on("doc_update", this.handle_realtime_update);
		},

		stop_realtime_updates(name) {
			unsubscribe_doc($socket, 'Sales Order', name);
			$socket.off("doc_update", this.handle_realtime_update);
		},

		handle_realtime_update(data) {
			// Do not reload if already loading or inactive
			if (this.order_resource.loading || !this.active) {
				return;
			}

			// Ignore if order id is not the same
			if (data.doctype != 'Sales Order' || data.name != this.name) {
				return;
			}

			// Do not reload if we have the same version
			if (data.modified == this.doc.modified) {
				return;
			}

			this.reload();
		}
	},

	computed: {
		doc() {
			return this.order_resource.data?.doc || {};
		},

		address() {
			return this.order_resource.data?.address || null;
		},

		contact() {
			return this.order_resource.data?.contact || null;
		},

		contacts() {
			return this.contact ? [this.contact] : [];
		},

		addresses() {
			return this.address ? [this.address] : [];
		},

		loading() {
			return this.order_resource.loading;
		},

		order_resource() {
			return this.$resources.get_sales_order;
		},
	},

	resources: {
		get_sales_order() {
			return {
				url: 'portal.sales_portal.api.orders.get_sales_order',
				method: 'GET',
				makeParams() {
					return {
						name: this.name
					}
				},
			}
		},
	},

	watch: {
		name: {
			handler(new_name, old_name) {
				if (!this.active) {
					return;
				}
				this.stop_realtime_updates(old_name);
				this.order_resource.reset();
				this.reload();
				this.setup_realtime_updates();
			},
		}
	},

	activated() {
		this.active = true;
		this.order_resource.reset();
		this.reload();
		this.setup_realtime_updates();
	},

	deactivated() {
		this.active = false;
		this.stop_realtime_updates(this.name);
	},
}
</script>
