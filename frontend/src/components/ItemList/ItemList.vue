<template>
	<div class="flex flex-col h-full">
		<ItemFilters :filters="filters" class="border-b border-gray-400 shadow-sm" />
		<ItemGrid :items="filtered_items" class="h-full" />
	</div>
</template>

<script>
import ItemGrid from "@/components/ItemList/ItemGrid.vue";
import ItemFilters from "@/components/ItemList/ItemFilters.vue";
import { item_list } from "@/data/items";

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
		}
	},

	methods: {
		get_clean_txt() {
			let txt = this.filters.txt || "";
			return txt.toString().trim();
		},
	},

	computed: {
		filtered_items() {
			let items = item_list.data || [];

			if (this.filters.item_group?.value) {
				items = items.filter(d => d.item_group === this.filters.item_group.value);
			}

			if (this.filters.brand?.value) {
				items = items.filter(d => d.brand === this.filters.brand.value);
			}

			let txt = this.get_clean_txt();
			if (txt) {
				items = items.filter(d => {
					return (
						d.item_name.toLowerCase().includes(txt.toLowerCase())
						|| d.name.toLowerCase().includes(txt.toLowerCase())
					)
				});
			}

			return items;
		}
	},
}
</script>
