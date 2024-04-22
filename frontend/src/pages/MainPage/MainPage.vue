<template>
	<div class="h-full overflow-hidden">
		<div class="flex h-full">
			<CartSidebar
				v-if="show_cart_sidebar"
				class="h-full w-[370px] flex-shrink-0 border-r border-gray-400"
				ref="cart-sidebar"
			/>

			<RouterView
				v-slot="{ Component }"
				class="h-full w-full"
				@item-selected="this.handle_item_selected"
				@item-group-selected="this.handle_item_group_selected"
				@brand-selected="this.handle_brand_selected"
				:selected_item_group=selected_item_group
				:selected_brand=selected_brand
			>
				<KeepAlive>
					<component :is="Component" />
				</KeepAlive>
			</RouterView>

			<SideBarNavigation
				class="h-full w-[76px] flex-shrink-0 border-l border-gray-400"
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
			selected_item_group: null,
			selected_brand: null
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
			this.selected_item_group = item_group;
			this.$router.push({ name: 'ItemListView' });
		},

		handle_brand_selected(brand) {
			this.selected_brand = brand;
			this.$router.push({ name: 'ItemListView' });
		}
	},

	computed: {
		show_cart_sidebar() {
			return !this.$route.meta.hide_sidebar;
		}
	},

	pageMeta() {
		return {
			title: 'Order Cart',
		}
	},
}
</script>
