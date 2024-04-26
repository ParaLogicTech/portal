<template>
	<GridView
		:has_data="has_data"
		:loading="loading"
		:is_empty="!item_groups?.length"
		loding="Loading Item Groups..."
		empty_message="No Item Groups Found"
	>
		<ItemGroupCard
			v-for="d in item_groups"
			:key="d.name"
			:item_group="d"
			:matches="get_matches(d)"
			@item-group-selected="this.handle_item_group_selected"
		/>
	</GridView>
</template>

<script>
import ItemGroupCard from "@/components/ItemGroup/ItemGroupCard.vue";
import GridView from "@/components/Utils/GridView.vue"

export default {
	name: "ItemGroupGrid",

	components: {
		ItemGroupCard,
		GridView
	},

	props: {
		item_groups: Array,
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
