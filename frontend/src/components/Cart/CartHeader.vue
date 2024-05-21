<template>
	<div class="flex justify-between items-center">
		<div class="flex items-center">
			<ShoppingBag class="inline h-[18px]" stroke-width="1.8px"/>

			<h1 class="text-xl font-semibold ml-0.5">
				Order Cart
			</h1>

			<div
				v-if="show_items_count"
				class="rounded py-1 px-1.5 text-xs font-semibold ml-1.5"
				:class="items_count_color"
			>
				{{ items_count }}
			</div>
		</div>

		<div class="flex items-center gap-1.5">
			<Spinner class="w-4" v-if="cart.loading" />

			<Popover>
				<template #target="{ togglePopover }">
					<Button
						variant="ghost"
						theme="gray"
						size="sm"
						class="w-[26px]"
						@click="togglePopover()"
					>
						<Ellipsis class="w-[18px]" stroke-width="2.5px"/>
					</Button>
				</template>
				<template #body="{ close }">
					<div class="bg-white border border-gray-300 rounded shadow-sm p-1 flex flex-col">
						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Reload Cart"
							class="!justify-start"
							@click="close(); reload_cart();"
						>
							<template #prefix>
								<RefreshCw class="h-[15px] w-[15px]" stroke-width="1.7px" />
							</template>
						</Button>
						<Button
							v-if="items_count > 0"
							variant="ghost"
							theme="red"
							size="sm"
							label="Clear Cart"
							class="!justify-start"
							@click="close(); clear_cart_dialog = true;"
						>
							<template #prefix>
								<Trash2 class="h-[15px] w-[15px]" />
							</template>
						</Button>
					</div>
				</template>
			</Popover>
		</div>

		<Dialog
			v-model="clear_cart_dialog"
			:options="{
				title: 'Confirm Clear Cart',
				message: 'Are you sure you want to clear all items from the cart?',
				size: 'xl',
				actions: [
					{
						label: 'Confirm',
						variant: 'solid',
						theme: 'red',
						onClick: () => {
							this.clear_cart();
						},
					},
				],
			}"
		/>
	</div>
</template>

<script>
import {cart} from "@/data/cart";
import {ShoppingBag, Ellipsis, Trash2, RefreshCw} from "lucide-vue-next";
import {Popover, Button} from "frappe-ui";

export default {
	name: "CartHeader",

	components: {RefreshCw, Trash2, Popover, Button, ShoppingBag, Ellipsis},

	data() {
		return {
			cart: cart,
			clear_cart_dialog: false,
		}
	},

	methods: {
		clear_cart() {
			this.$emit("clear-cart");
			this.clear_cart_dialog = false;
		},

		reload_cart() {
			this.$emit("reload-cart");
		},
	},

	computed: {
		show_items_count() {
			return !!cart.doc;
		},

		items_count_color() {
			if (this.items_count) {
				return "bg-green-300 text-green-900";
			} else {
				return "bg-gray-200 text-gray-800";
			}
		},

		items_count() {
			return cart.doc?.items?.length || 0;
		},
	}
}
</script>
