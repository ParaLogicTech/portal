<template>
	<div class="h-full overflow-y-scroll">
		<CartSidebarItem
			v-for="row in doc.items || []"
			:row="row"
			@qty-changed="this.handle_qty_changed"
			@select-next-row="this.select_next_row"
			@select-previous-row="this.select_previous_row"
			ref="items"
		/>
	</div>
</template>

<script>
import CartSidebarItem from "@/components/Cart/CartSidebarItem.vue";
import {cart} from "@/data/cart";

export default {
	name: "CartSidebar",

	components: {
		CartSidebarItem
	},

	data() {
		return {
			cart: cart
		}
	},

	methods: {
		handle_qty_changed(row) {
			this.$emit('qty-changed', row);
		},

		select_item(item_code) {
			let component = this.$refs["items"].find(d => d.row.item_code === item_code);
			if (component) {
				component.select_row();
			}
		},

		select_next_row(current_row) {
			let current_row_idx = this.$refs["items"].findIndex(d => d.row == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.$refs["items"].length) {
				this.$refs["items"][current_row_idx + 1].select_row();
			}
		},

		select_previous_row(current_row) {
			let current_row_idx = this.$refs["items"].findIndex(d => d.row == current_row);
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
