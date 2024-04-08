<template>
	<div class="flex flex-col h-full">
		<ItemFilters
			:filters="filters"
			class="flex-shrink-0 border-b border-gray-400 shadow-sm"
		/>
		<ItemGrid
			:items="filtered_items"
			:loading="item_list.list.loading"
			:has_data="item_list.data?.length > 0"
			:matches="fuzzy_matches"
			class="h-full"
			@item-selected="this.handle_item_selected"
		/>
	</div>
</template>

<script>
import ItemGrid from "@/components/Item/ItemGrid.vue";
import ItemFilters from "@/components/Item/ItemFilters.vue";
import { item_list, active_items, in_item_group } from "@/data/items";
import Fuse from 'fuse.js'

export default {
	name: "ItemListView",

	components: {
		ItemFilters,
		ItemGrid,
	},

	data() {
		return {
			filters: {
				txt: null,
				item_group: null,
				brand: null,
			},
			item_list: item_list,
			active_items: active_items,
		}
	},

	computed: {
		filtered_items() {
			let items = this.fuzzy_filtered_items;

			if (this.filters.brand?.value) {
				items = items.filter(d => d.brand === this.filters.brand.value);
			}

			if (this.filters.item_group?.value) {
				items = items.filter(d => in_item_group(d.item_group, this.filters.item_group.value));
			}

			if (!this.filters_applied) {
				items = items.slice(0, 100);
			}

			return items;
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
				return this.active_items;
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
			let items = this.active_items;
			let fuse = new Fuse(items, {
				keys: ['item_name', 'name'],
				threshold: 0.4,
				includeMatches: true,
				minMatchCharLength: 2,
			});
			return fuse.search(txt);
		},

		handle_item_selected(item) {
			this.$emit('item-selected', item);
		}
	},
}
</script>
