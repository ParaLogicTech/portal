<template>
	<div class="flex flex-col h-full">
		<CartHeader
			class="top-bar-height controls-bg px-2 py-1 border-b border-gray-400"
			@clear-cart="handle_clear_cart"
			@reload-cart="handle_reload_cart"
		/>

		<div class="p-2 border-b border-gray-400 shadow-sm">
			<CustomerSelection/>
		</div>

		<CompactOrderItemsList
			v-model:doc="model"
			class="h-full overflow-y-scroll"
			ref="items"
			@qty-changed="handle_qty_change"
			@item-removed="handle_item_removed"
		/>

		<div class="h-[43px] flex-none p-1.5 border-t border-gray-400">
			<Button
				variant="solid"
				theme="blue"
				size="sm"
				label="Open Order Cart"
				:link="null"
				@click="open_cart"
				class="w-full h-full"
			>
				<template #prefix>
					<ShoppingBag class="h-3.5" />
				</template>
			</Button>
		</div>
	</div>
</template>

<script>
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import CartHeader from "@/components/Cart/CartHeader.vue";
import {Button} from "frappe-ui";
import {ShoppingBag} from "lucide-vue-next"
import CompactOrderItemsList from "@/components/Order/CompactOrderItemsList.vue";
import CartController from "@/mixins/CartController";

export default {
	name: "CartSidebar",

	mixins: [CartController],

	components: {
		CartHeader,
		CompactOrderItemsList,
		Button,
		CustomerSelection,
		ShoppingBag,
	},

	methods: {
		open_cart() {
			this.$router.push({name: "CartView"});
		},

		async select_item(item_code) {
			await this.refresh_view();
			this.$refs.items?.select_item(item_code);
		},

		async refresh_view() {
			this.refresh_cart_model();
			return this.$nextTick(() => {
				this.$refs.items?.refresh_view();
			});
		},
	},
}
</script>
