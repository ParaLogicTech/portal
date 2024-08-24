<template>
	<div class="flex flex-col h-full">
		<!-- Title -->
		<div class="flex items-center top-bar-height controls-bg px-3 py-1 border-b border-gray-400">
			<Award class="inline h-[17px] text-gray-900" stroke-width="1.9px"/>
			<h1 class="text-xl font-semibold ml-0.5">Brands</h1>
		</div>

		<SearchFilter
			:filters="filters"
			class="flex-none border-b border-gray-400 shadow-sm"
			placeholder="Search Brands..."
		/>
		<BrandGrid
			:brands="filtered_brands"
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
import {Award} from "lucide-vue-next";

export default {
	name: "BrandListView",

	components: {
		Award,
		SearchFilter,
		BrandGrid,
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
	},

	methods: {
		handle_brand_selected(brand) {
			this.$emit('brand-selected', brand);
		}
	}
}
</script>
