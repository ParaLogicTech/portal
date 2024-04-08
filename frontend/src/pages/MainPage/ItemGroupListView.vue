<template>
	<div class="flex flex-col h-full">
		<ItemGroupFilters
			:filters="filters"
			class="border-b border-gray-400 shadow-sm"
		/>
		<ItemGroupGrid
			:items="fuzzy_filtered_items"
			:loading="item_group_list.list.loading"
			:matches="fuzzy_matches"
			class="h-full"
		/>
	</div>
</template>

<script>
import ItemGroupFilters from "@/components/ItemGroup/ItemGroupFilters.vue";
import ItemGroupGrid from "@/components/ItemGroup/ItemGroupGrid.vue";
import { item_group_list } from "@/data/items";
import Fuse from 'fuse.js'

export default {
	name: "ItemGroupListView",

	data() {
		return {
			filters: {
				txt: null,
			},
			item_group_list: item_group_list,
		}
	},

	components: {
		ItemGroupFilters,
		ItemGroupGrid,
	},

	computed: {
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
				return this.item_group_list.data;
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
		}
	},

	methods: {
		fuzzy_search(txt) {
			let items = this.item_group_list.data;
			let fuse = new Fuse(items, {
				keys: ['item_name', 'name'],
				threshold: 0.4,
				includeMatches: true,
				minMatchCharLength: 2,
			});
			return fuse.search(txt);
		},
	},
}
</script>
