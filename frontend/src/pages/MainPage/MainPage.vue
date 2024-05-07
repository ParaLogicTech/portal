<template>
	<div class="h-full overflow-hidden">
		<div class="flex h-full">
			<SideBarNavigation
				class="h-full w-[76px] flex-none border-r border-gray-400"
			/>

			<RouterView
				v-slot="{ Component }"
				class="h-full w-full min-w-0 flex-initial"
				@item-selected="this.handle_item_selected"
				@item-group-selected="this.handle_item_group_selected"
				@brand-selected="this.handle_brand_selected"
			>
				<KeepAlive>
					<component :is="Component" ref="router_view" />
				</KeepAlive>
			</RouterView>

			<CartSidebar
				v-if="show_cart_sidebar"
				class="h-full w-[370px] flex-none border-l border-gray-400"
				ref="cart_sidebar"
			/>
		</div>
	</div>
</template>

<script>
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import CartSidebar from "@/components/Cart/CartSidebar.vue";
import SideBarNavigation from "@/components/SideBarNavigation.vue";
import {cart} from "@/data/cart";
import {createAlert} from "@/utils/alerts";

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
		}
	},

	methods: {
		async handle_item_selected(item) {
			if (!cart.customer && !cart.cart_id) {
				createAlert({"title": "Please select customer first", "variant": "warning"});
				return;
			}

			if (!cart.has_item(item.item_code)) {
				await cart.update_item_qty(item.item_code, 1);
			}
			this.$refs.cart_sidebar.select_item(item.item_code);
		},

		async handle_item_group_selected(item_group) {
			await this.$router.push({name: 'ItemListView'});
			if (this.$refs.router_view.set_item_group_filter) {
				this.$refs.router_view.set_item_group_filter(item_group);
			}
		},

		async handle_brand_selected(brand) {
			await this.$router.push({name: 'ItemListView'});
			if (this.$refs.router_view.set_brand_filter) {
				this.$refs.router_view.set_brand_filter(brand);
			}
		},
	},

	computed: {
		show_cart_sidebar() {
			return this.$route.meta.show_cart_sidebar;
		}
	},

	pageMeta() {
		return {
			title: 'Sales Portal',
		}
	},
}
</script>
