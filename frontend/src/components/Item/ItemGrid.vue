<template>
	<GridView
		:has_data="has_data"
		:loading="loading"
		:is_empty="!items?.length"
		loding="Loading Items..."
		empty_message="No Items Found"
	>
		<ItemCard
			v-for="d in items"
			:key="d.name"
			:item="d"
			:matches="get_matches(d)"
			@item-selected="this.handle_item_selected"
		/>
	</GridView>
</template>

<script>
import ItemCard from "@/components/Item/ItemCard.vue";
import GridView from "@/components/Utils/GridView.vue"

export default {
	name: "ItemGrid",

	components: {
		ItemCard,
		GridView,
	},

	props: {
		items: Array,
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
	},

	methods: {
		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		handle_item_selected(item, open_cart) {
			this.$emit('item-selected', item, open_cart);
		}
	}
}
</script>
