<template>
	<div
		class="flex flex-col rounded shadow border border-gray-400 cursor-pointer hover:border-yellow-700 hover:shadow-md transition-all duration-150 ease-in-out"
		@click="this.handle_click"
	>
		<ItemImage :item="item" class="h-[220px] flex-shrink-0" rounded="rounded rounded-b-none" />

		<div class="flex flex-col justify-between h-full border-t border-gray-200">
			<h1 class="text-sm font-medium px-3 py-2.5">
				<HighlightedMatchText
					:text="item.item_name"
					:matches="item_name_matches"
				/>
			</h1>

			<div class="flex flex-wrap gap-1 justify-between items-center px-3 py-2.5 border-t border-gray-200">
				<ItemStock :item="item" class="text-xs" />
				<ItemPrice :item="item" class="text-md font-semibold text-violet-900" />
			</div>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/ItemList/ItemImage.vue";
import HighlightedMatchText from "@/components/HighlightedMatchText.vue";
import ItemStock from "@/components/ItemList/ItemStock.vue";
import ItemPrice from "@/components/ItemList/ItemPrice.vue";

export default {
	name: "ItemCard",

	components: {
		ItemImage,
		HighlightedMatchText,
		ItemStock,
		ItemPrice,
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
		}
	}
}
</script>
