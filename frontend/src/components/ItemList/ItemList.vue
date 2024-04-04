<template>
	<div class="flex flex-col h-full">
		<ItemFilters
			:filters="filters"
			class="flex-shrink-0 border-b border-gray-400 shadow-sm"
		/>
		<ItemGrid
			:items="filtered_items"
			:loading="item_list.list.loading"
			:matches="fuzzy_matches"
			class="h-full"
			@item-selected="this.handle_item_selected"
		/>
	</div>
</template>

<script>
import ItemGrid from "@/components/ItemList/ItemGrid.vue";
import ItemFilters from "@/components/ItemList/ItemFilters.vue";
import { item_list, active_items, in_item_group } from "@/data/items";
import Fuse from 'fuse.js'

export default {
	name: "ItemList",

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

			return items.splice(0, 10);
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
		}
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
