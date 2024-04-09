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
		<Spinner class="w-4" v-if="cart.loading" />
	</div>
</template>

<script>
import {cart} from "@/data/cart";
import {ShoppingBag} from "lucide-vue-next";

export default {
	name: "CartHeader",

	components: {ShoppingBag},

	data() {
		return {
			cart: cart,
		}
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
