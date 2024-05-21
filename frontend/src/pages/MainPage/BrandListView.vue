<template>
	<div class="flex flex-col h-full">
		<SearchFilter
			:filters="filters"
			class="flex-none border-b border-gray-400 shadow-sm"
			placeholder="Search Brands..."
		/>
		<BrandGrid
			:brand_list="filtered_brands"
			:loading="brand_list.list.loading"
			:has_data="brand_list.data?.length > 0"
			:matches="fuzzy_matches"
			class="h-full"
			@brand-selected="this.handle_brand_selected"
		/>
	</div>
</template>

<script>
import SearchFilter from "@/components/Utils/SearchFilter.vue";
import BrandGrid from "@/components/Brand/BrandGrid.vue";
import {active_brands, brand_list} from "@/data/items";
import FuzzySearch from "@/mixins/FuzzySearch";

export default {
	name: "BrandListView",

	components: {
		SearchFilter,
		BrandGrid
	},

	mixins: [FuzzySearch],

	data() {
		return {
			filters: {
				txt: null,
			},
			brand_list: brand_list,
		}
	},

	computed: {
		filtered_brands() {
			return this.fuzzy_filtered_items;
		},

		list_data() {
			return active_brands.value || [];
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
		handle_brand_selected(brand) {
			this.$emit('brand-selected', brand);
		}
	}
}
</script>
