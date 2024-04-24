<template>
	<GridView
		:has_data="has_data"
		:loading="loading"
		:is_empty="!brand_list?.length"
		loding="Loading Brands..."
		empty_message="No Brands Found"
	>
		<BrandCard
			v-for="d in brand_list"
			:key="d.name"
			:brand_list="d"
			:matches="get_matches(d)"
			@brand-selected="this.handle_brand_selected"
		/>
	</GridView>
</template>

<script>
import BrandCard from "@/components/Brand/BrandCard.vue";
import GridView from "@/components/Utils/GridView.vue"

export default {
	name: "BrandGrid",

	components: {
		BrandCard,
		GridView
	},

	props: {
		brand_list: Array,
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
	},

	methods: {
		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		handle_brand_selected(brand) {
			this.$emit('brand-selected', brand);
		}
	}
}
</script>
