<template>
	<div class="flex flex-col h-full">
		<SearchFilter
			:filters="filters"
			class="flex-shrink-0 border-b border-gray-400 shadow-sm"
			placeholder="Search Item Group..."
		/>
		<ItemGroupGrid
			:item_groups="filtered_item_groups"
			:loading="item_group_list.list.loading"
			:has_data="item_group_list.data?.length > 0"
			:matches="fuzzy_matches"
			@item-group-selected="this.handle_item_group_selected"
			class="h-full"
		/>
	</div>
</template>

<script>
import SearchFilter from "@/components/Utils/SearchFilter.vue";
import ItemGroupGrid from "@/components/ItemGroup/ItemGroupGrid.vue";
import {active_item_groups, item_group_list} from "@/data/items";
import fuzzy_search from "@/mixins/fuzzy_search";

export default {
	name: "ItemGroupListView",

	components: {
		SearchFilter,
		ItemGroupGrid
	},

	mixins: [fuzzy_search],

	data() {
		return {
			filters: {
				txt: null,
			},
			item_group_list: item_group_list,
			active_item_groups: active_item_groups,
		}
	},

	computed: {
		filtered_item_groups() {
			return this.fuzzy_filtered_items;
		},

		list_data() {
			return this.active_item_groups || [];
		},

		filters_applied() {
			let applied = false;
			for (let v of Object.values(this.filters)) {
				if (v) {
					applied = true;
					break
				}
			}
			return applied;
		},
	},

	methods: {
		handle_item_group_selected(item_group) {
			this.$emit('item-group-selected', item_group);
		}
	},
}
</script>
