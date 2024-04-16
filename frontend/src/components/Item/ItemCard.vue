<template>
	<div
		class="item-card clickable"
		@click="this.handle_click"
	>
		<div class="item-card-indicators">
			<div
				v-if="is_in_cart"
				class="text-blue-900 bg-blue-200 p-1 text-xs border border-blue-400 rounded"
			>
				<Check class="h-3.5 w-3.5 mr-1 inline" stroke-width="1.8px"/>
				<span>In Cart: {{ cart_qty }} {{ cart_uom }}</span>
			</div>
		</div>

		<div class="flex flex-col h-full">
			<ItemImage
				:item="item"
				class="h-[220px] flex-shrink-0"
				rounded="rounded rounded-b-none"
			/>

			<div class="flex flex-col justify-between h-full item-card-separator">
				<h1 class="text-sm font-medium px-3 py-2.5">
					<HighlightedMatchText
						:text="item.item_name"
						:matches="item_name_matches"
					/>
				</h1>

				<div class="flex flex-wrap gap-1 justify-between items-center px-3 py-2.5 item-card-separator">
					<ItemStock :item="item" class="text-xs" />
					<ItemPrice :item="item" class="text-md font-semibold text-violet-900" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/Item/ItemImage.vue";
import HighlightedMatchText from "@/components/Utils/HighlightedMatchText.vue";
import ItemStock from "@/components/Item/ItemStock.vue";
import ItemPrice from "@/components/Item/ItemPrice.vue";
import {cart} from "@/data/cart";
import {Check} from "lucide-vue-next";

export default {
	name: "ItemCard",

	components: {
		ItemImage,
		HighlightedMatchText,
		ItemStock,
		ItemPrice,
		Check,
	},

	props: {
		item: Object,
		matches: Array,
	},

	methods: {
		handle_click() {
			this.$emit('item-selected', this.item);
		}
	},

	computed: {
		item_name_matches() {
			return (this.matches || []).filter(d => d.key == "item_name")[0] || {};
		},

		cart_qty() {
			return cart.get_row_by_item(this.item.name)?.qty || 0;
		},

		cart_uom() {
			return cart.get_row_by_item(this.item.name)?.uom;
		},

		is_in_cart() {
			return cart.has_item(this.item.name);
		},
	}
}
</script>