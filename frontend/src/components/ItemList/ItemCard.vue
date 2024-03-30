<template>
	<div class="flex flex-col rounded shadow border border-gray-400">
		<ItemImage :item="item" class="h-[220px] flex-shrink-0" />

		<div class="flex flex-col justify-between h-full">
			<h1 class="text-sm font-medium px-3 py-2.5">
				<HighlightedMatchText
					:text="item.item_name"
					:matches="item_name_matches"
				/>
			</h1>

			<div class="flex flex-wrap gap-1 justify-between items-center px-3 py-2.5 border-t">
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

	computed: {
		item_name_matches() {
			return (this.matches || []).filter(d => d.key == "item_name")[0] || {};
		}
	}
}
</script>
