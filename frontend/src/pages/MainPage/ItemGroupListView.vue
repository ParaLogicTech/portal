<template>
	<div class="flex flex-col h-full">
		<!-- Title -->
		<div class="flex items-center top-bar-height controls-bg px-3 py-1 border-b border-gray-400">
			<Boxes class="inline h-[19px] text-gray-900" stroke-width="1.5px"/>
			<h1 class="text-xl font-semibold ml-1">Item Groups</h1>
		</div>

		<SearchFilter
			:filters="filters"
			class="flex-none border-b border-gray-400 shadow-sm"
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
import FuzzySearch from "@/mixins/FuzzySearch";
import {Boxes} from "lucide-vue-next";

export default {
	name: "ItemGroupListView",

	components: {
		Boxes,
		SearchFilter,
		ItemGroupGrid,
	},

	mixins: [FuzzySearch],

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
