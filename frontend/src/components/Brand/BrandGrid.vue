<template>
	<GridListView
		:items="brands"
		:has_data="has_data"
		:loading="loading"
		loding="Loading Brands..."
		empty_message="No Brands Found"
		v-slot="{item: d}"
	>
		<BrandCard
			:key="d.name"
			:brand="d"
			:matches="get_matches(d)"
			@brand-selected="this.handle_brand_selected"
		/>
	</GridListView>
</template>

<script>
import BrandCard from "@/components/Brand/BrandCard.vue";
import GridListView from "@/components/GridList/GridListView.vue"

export default {
	name: "BrandGrid",

	components: {
		BrandCard,
		GridListView
	},

	props: {
		brands: {
			type: Array,
			required: true,
		},
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
