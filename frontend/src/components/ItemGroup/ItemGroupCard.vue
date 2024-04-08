<template>
	<div class="flex flex-col item-card clickable">
		<ItemImage
			:item="item_group"
			class="h-[220px] flex-shrink-0"
			rounded="rounded rounded-b-none"
		/>

		<div class="flex flex-col justify-between h-full item-card-separator">
			<h1 class="text-sm font-medium px-3 py-2.5">
				<HighlightedMatchText
					:text="item_group.name"
					:matches="item_group_matches"
				/>
			</h1>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/Item/ItemImage.vue";
import HighlightedMatchText from "@/components/Utils/HighlightedMatchText.vue";

export default {
	name: "ItemGroupCard",

	components: {
		ItemImage,
		HighlightedMatchText,
	},

	props: {
		item_group: Object,
		matches: Array,
	},

	computed: {
		item_group_matches() {
			return (this.matches || []).filter(d => d.key == "name")[0] || {};
		}
	},
}
</script>
