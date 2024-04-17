<template>
	<div class="flex flex-col h-full">
		<ItemGroupFilters
			:filters="filters"
			class="flex-shrink-0 border-b border-gray-400 shadow-sm"
		/>
		<ItemGroupGrid
			:item_groups="filtered_item_groups"
			:loading="item_group_list.list.loading"
			:has_data="active_item_groups?.length > 0"
			:matches="fuzzy_matches"
			@item-group-selected="this.handle_item_group_selected"
			class="h-full"
		/>
	</div>
</template>

<script>
import ItemGroupFilters from "@/components/ItemGroup/ItemGroupFilters.vue";
import ItemGroupGrid from "@/components/ItemGroup/ItemGroupGrid.vue";
import {active_item_groups, item_group_list} from "@/data/items";
import Fuse from 'fuse.js'

export default {
	name: "ItemGroupListView",

	components: {
		ItemGroupFilters,
		ItemGroupGrid,
	},

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

		fuzzy_matches() {
			let out = {};
			if (this.fuzzy_match_result) {
				for (let d of this.fuzzy_match_result) {
					out[d.item.name] = d.matches
				}
			}
			return out;
		},

		fuzzy_filtered_items() {
			if (this.fuzzy_match_result) {
				return this.fuzzy_match_result.map(d => d.item);
			} else {
				return this.active_item_groups;
			}
		},

		fuzzy_match_result() {
			if (this.clean_txt) {
				return this.fuzzy_search(this.clean_txt);
			} else {
				return null;
			}
		},

		clean_txt() {
			let txt = this.filters.txt || "";
			return txt.toString().trim();
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
		fuzzy_search(txt) {
			let items = this.active_item_groups;
			let fuse = new Fuse(items, {
				keys: ['name'],
				threshold: 0.4,
				includeMatches: true,
				minMatchCharLength: 2,
			});
			return fuse.search(txt);
		},

		handle_item_group_selected(item_group) {
			this.$emit('item-group-selected', item_group);
		}
	},
}
</script>
