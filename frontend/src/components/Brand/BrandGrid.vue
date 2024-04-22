<template>
	<div class="@container p-3 overflow-y-scroll">
		<div v-if="loading && !has_data" class="h-full flex items-center justify-center text-gray-700 text-xl">
			<Spinner class="w-5 mr-2" />
			<span>Loading Brands..</span>
		</div>

		<div
			v-else-if="!brand_list?.length"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
		>
			<CircleSlash class="h-5 w-5 mr-2" />
			<div>No Brands Found</div>
		</div>

		<div v-else class="grid @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5 gap-3">
			<BrandCard
				v-for="d in brand_list"
				:key="d.name"
				:brand_list="d"
				:matches="get_matches(d)"
				@brand-selected="this.handle_brand_selected"
			/>
		</div>
	</div>
</template>

<script>
import BrandCard from "@/components/Brand/BrandCard.vue";
import {CircleSlash} from "lucide-vue-next";

export default {
	name: "BrandGrid",

	components: {
		CircleSlash,
		BrandCard,
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
