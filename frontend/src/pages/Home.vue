<template>
	<div class="h-screen overflow-hidden">
		<div class="flex h-full">
			<div class="flex flex-col flex-shrink-0 w-[360px] border-r border-gray-400 h-full">
				<div class="p-2 border-b border-gray-400 shadow-sm flex-shrink-0">
					<CustomerSelection/>
				</div>
				<CartSidebar
					class="h-full"
					ref="cart-sidebar"
					@qty-changed="this.handle_qty_changed"
				/>
			</div>
			<ItemList
				class="h-full w-full"
				@item-selected="this.handle_item_selected"
			/>
		</div>
	</div>
</template>

<script>
import ItemList from '@/components/ItemList/ItemList.vue'
import CustomerSelection from "@/components/Customers/CustomerSelection.vue";
import CartSidebar from "@/components/Cart/CartSidebar.vue";
import {cart} from "@/data/cart";

export default {
	name: 'Home',

	components: {
		CustomerSelection,
		CartSidebar,
		ItemList,
	},

	data() {
		return {
			cart: cart,
		}
	},

	methods: {
		async handle_item_selected(item) {
			if (!cart.has_item(item.item_code)) {
				await this.cart.update_item_qty(item.item_code, 1);
			}
			this.$refs["cart-sidebar"].select_item(item.item_code);
		},

		handle_qty_changed(row) {
			cart.update_item_qty(row.item_code, row.qty, row.uom);
		}
	},

	pageMeta() {
		return {
			title: 'Home Page Title',
		}
	},
}
</script>
