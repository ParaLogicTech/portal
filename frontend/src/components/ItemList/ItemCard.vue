<template>
	<div class="max-w rounded overflow-hidden shadow border border-gray-400 h-full">
		<ItemImage :item="item" class="h-[220px]" />
		<div class="p-3">
			<h1 class="font-medium text-sm">
			<HighlightedMatchText
				:text="item.item_name"
				:matches="item_name_matches"
			/>
			</h1>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/ItemList/ItemImage.vue";
import HighlightedMatchText from "@/components/HighlightedMatchText.vue";

export default {
	name: "ItemCard",

	components: {
		ItemImage,
		HighlightedMatchText,
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
