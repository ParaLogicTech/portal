<template>
	<GridListView
		:items="item_groups"
		:has_data="has_data"
		:loading="loading"
		loding="Loading Item Groups..."
		empty_message="No Item Groups Found"
		v-slot="{item: d}"
	>
		<ItemGroupCard
			:key="d.name"
			:item_group="d"
			:matches="get_matches(d)"
			@item-group-selected="this.handle_item_group_selected"
		/>
	</GridListView>
</template>

<script>
import ItemGroupCard from "@/components/ItemGroup/ItemGroupCard.vue";
import GridListView from "@/components/Utils/GridListView.vue"

export default {
	name: "ItemGroupGrid",

	components: {
		ItemGroupCard,
		GridListView
	},

	props: {
		item_groups: {
			type: Array,
			required: true,
		},
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
	},

	methods: {
		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		handle_item_group_selected(item_group) {
			this.$emit('item-group-selected', item_group);
		}
	}
}
</script>
