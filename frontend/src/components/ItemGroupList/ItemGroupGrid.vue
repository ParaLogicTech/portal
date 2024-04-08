<template>
	<div class="@container p-3 overflow-y-scroll">
		<div v-if="loading" class="h-full flex items-center justify-center text-gray-700 text-xl">
			<Spinner class="w-5 mr-2" />
			<span>Loading Items...</span>
		</div>

		<div
			v-else-if="!items || !items.length"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
		>
			<FeatherIcon
				name="x"
				class="h-5 w-5 mr-1"
				aria-hidden="true"
			/>
			<div>No Items Found</div>
		</div>

		<div v-else class="grid @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5 gap-3">
			<ItemGroupCard
				v-for="item in items"
				:key="item.name"
				:item="item"
				:matches="get_item_matches(item)"
			/>
		</div>
	</div>
</template>

<script>
import ItemGroupCard from "@/components/ItemGroupList/ItemGroupCard.vue";

export default {
	name: "ItemGroupGrid",

	components: {
		ItemGroupCard,
	},

	props: {
		items: Array,
		matches: Object,
		loading: Boolean,
	},

	methods: {
		get_item_matches(item) {
			return this.matches ? this.matches[item.name] : [];
		}
	}
}
</script>
