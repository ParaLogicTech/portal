<template>
	<div class="flex flex-col rounded shadow border border-gray-400 cursor-pointer hover:border-yellow-700 hover:shadow-md transition-all duration-150 ease-in-out relative">

		<ItemImage :item="item" class="h-[220px] flex-shrink-0" />

		<div class="flex flex-col justify-between h-full">
			<h1 class="text-sm font-medium px-3 py-2.5">
				<HighlightedMatchText
					:text="item.name"
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
	name: "ItemGroupCard",

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
			return (this.matches || []).filter(d => d.key == "item.name")[0] || {};
		}
	},
}
</script>
