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
import fuzzy_search from "@/mixins/fuzzy_search";

export default {
	name: "ItemListView",

	components: {
		ItemFilters,
		ItemGrid,
	},

	mixins: [fuzzy_search],

	data() {
		return {
			filters: {
				txt: null,
				item_group: null,
				brand: null,
			},
			item_list: item_list,
			fuzzy_search_keys: ['item_name', 'name'],
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

		list_data() {
			return active_items.value || [];
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
		handle_item_selected(item) {
			this.$emit('item-selected', item);
		},

		set_item_group_filter(value) {
			if (value) {
				this.filters.item_group = { label: value, value: value };
			} else {
				this.filters.item_group = null;
			}
		},

		set_brand_filter(value) {
			if (value) {
				this.filters.brand = { label: value, value: value };
			} else {
				this.filters.brand = null;
			}
		},
	},
}
</script>
