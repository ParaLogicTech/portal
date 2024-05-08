<template>
	<div class="flex flex-col h-full">
		<CartHeader class="top-bar-height controls-bg px-2 py-1 border-b border-gray-400"/>

		<div class="p-2 border-b border-gray-400 shadow-sm">
			<CustomerSelection/>
		</div>

		<div class="h-full overflow-y-scroll">
			<div
				v-if="is_empty"
				class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
			>
				<CircleSlash class="h-5 w-5 mr-2" />
				<div>Cart is empty</div>
			</div>

			<CartSidebarItem
				v-else
				v-for="row in doc.items || []"
				:row="row"
				:key="row.name || row.item_code"
				@select-next-row="this.select_next_row"
				@select-previous-row="this.select_previous_row"
				ref="items"
			/>
		</div>

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
import CartSidebarItem from "@/components/Cart/CartSidebarItem.vue";
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import {cart} from "@/data/cart";
import {CircleSlash, SendHorizontal} from "lucide-vue-next"
import CartHeader from "@/components/Cart/CartHeader.vue";
import {Button} from "frappe-ui";
import {ShoppingBag} from "lucide-vue-next"

export default {
	name: "CartSidebar",

	components: {
		SendHorizontal, Button,
		CartHeader,
		CustomerSelection,
		CartSidebarItem,
		CircleSlash,
		ShoppingBag,
	},

	data() {
		return {
			cart: cart
		}
	},

	methods: {
		open_cart() {
			this.$router.push({name: "CartView"});
		},

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
		is_empty() {
			return !this.doc.items?.length;
		},

		doc() {
			return this.cart.doc || {};
		}
	}
}
</script>
