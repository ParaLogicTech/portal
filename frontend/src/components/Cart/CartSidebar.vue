<template>
	<div class="flex flex-col h-full">
		<div class="flex-shrink-0 flex flex-col justify-center px-2 py-1 border-b border-gray-400" style="min-height: 48px;">
			<div class="flex justify-between">
				<h1 class="text-xl font-semibold">
					<span>Order Cart</span>
					<FeatherIcon name="shopping-cart" class="inline h-4 ml-1.5"/>
				</h1>
				<Spinner class="w-4" v-if="cart.loading" />
			</div>
		</div>

		<div class="p-2 border-b border-gray-400 shadow-sm">
			<CustomerSelection/>
		</div>

		<div class="h-full overflow-y-scroll">
			<CartSidebarItem
				v-for="row in doc.items || []"
				:row="row"
				:key="row.name || row.item_code"
				@select-next-row="this.select_next_row"
				@select-previous-row="this.select_previous_row"
				ref="items"
			/>
		</div>
	</div>
</template>

<script>
import CartSidebarItem from "@/components/Cart/CartSidebarItem.vue";
import CustomerSelection from "@/components/Customers/CustomerSelection.vue";
import {cart} from "@/data/cart";

export default {
	name: "CartSidebar",

	components: {
		CustomerSelection,
		CartSidebarItem
	},

	data() {
		return {
			cart: cart
		}
	},

	methods: {
		select_item(item_code) {
			let component = (this.$refs["items"] || []).find(d => d.row.item_code === item_code);
			if (component) {
				component.select_row(true);
			}
		},

		select_next_row(current_row) {
			let current_row_idx = (this.$refs["items"] || []).findIndex(d => d.row == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.$refs["items"].length) {
				this.$refs["items"][current_row_idx + 1].select_row();
			}
		},

		select_previous_row(current_row) {
			let current_row_idx = (this.$refs["items"] || []).findIndex(d => d.row == current_row);
			if (current_row_idx != -1 && current_row_idx - 1 >= 0) {
				this.$refs["items"][current_row_idx - 1].select_row();
			}
		},
	},

	computed: {
		doc() {
			return this.cart.doc || {};
		}
	}
}
</script>
