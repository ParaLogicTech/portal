<template>
	<div class="max-w rounded overflow-hidden shadow border border-gray-400 h-full">
		<ItemImage :item="item" class="h-[220px]" />
		<div class="p-3">
			<h1 class="font-medium text-sm">{{ item.item_name }}</h1>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/ItemList/ItemImage.vue";

export default {
	name: "ItemCard",

	components: {
		ItemImage
	},

	props: {
		item: Object,
	},

	computed: {
		item_code() {
			return this.item.name
		}
	}
}
</script>
