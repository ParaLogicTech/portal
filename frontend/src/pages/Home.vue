<template>
	<div class="h-full overflow-hidden">
		<div class="flex h-full">
			<CartSidebar
				class="h-full w-[370px] flex-shrink-0 border-r border-gray-400"
				ref="cart-sidebar"
			/>

			<router-view @item-selected="this.handle_item_selected"></router-view>

			<SideBarNavigation
				class="h-full w-[100px] border-l border-gray-400"
			/>
		</div>
	</div>
</template>

<script>
import CustomerSelection from "@/components/Customers/CustomerSelection.vue";
import CartSidebar from "@/components/Cart/CartSidebar.vue";
import SideBarNavigation from "@/components/SideBarNavigation.vue";
import {cart} from "@/data/cart";

export default {
	name: 'Home',

	components: {
		CustomerSelection,
		CartSidebar,
		SideBarNavigation
	},

	data() {
		return {
			cart: cart,
		}
	},

	methods: {
		async handle_item_selected(item) {
			if (!cart.has_item(item.item_code)) {
				await cart.update_item_qty(item.item_code, 1);
			}
			this.$refs["cart-sidebar"].select_item(item.item_code);
		},
	},

	pageMeta() {
		return {
			title: 'Order Cart',
		}
	},
}
</script>
