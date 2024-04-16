<template>
	<div class="h-full overflow-hidden">
		<div class="flex h-full">
			<CartSidebar
				class="h-full w-[370px] flex-shrink-0 border-r border-gray-400"
				ref="cart-sidebar"
			/>

			<RouterView
				v-slot="{ Component }"
				class="h-full w-full"
				@item-selected="this.handle_item_selected"
				@item-group-selected="this.handle_item_group_selected"
			>
				<KeepAlive>
					<component :is="Component" :selectedItemGroup = selectedItemGroup />
				</KeepAlive>
			</RouterView>

			<SideBarNavigation
				class="h-full w-[100px] border-l border-gray-400"
			/>
		</div>
	</div>
</template>

<script>
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import CartSidebar from "@/components/Cart/CartSidebar.vue";
import SideBarNavigation from "@/components/SideBarNavigation.vue";
import {cart} from "@/data/cart";

export default {
	name: "MainPage",

	components: {
		CustomerSelection,
		CartSidebar,
		SideBarNavigation,
	},

	data() {
		return {
			cart: cart,
			selectedItemGroup: null,
		}
	},

	methods: {
		async handle_item_selected(item) {
			if (!cart.has_item(item.item_code)) {
				await cart.update_item_qty(item.item_code, 1);
			}
			this.$refs["cart-sidebar"].select_item(item.item_code);
		},

		handle_item_group_selected(item_group) {
			this.selectedItemGroup = item_group;
			this.$router.push({ name: 'ItemListView' });
		},
	},

	pageMeta() {
		return {
			title: 'Order Cart',
		}
	},
}
</script>
