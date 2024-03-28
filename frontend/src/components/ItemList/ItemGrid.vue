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
			<ItemCard v-for="item in items" :key="item.name" :item="item" />
		</div>
	</div>
</template>

<script>
import ItemCard from "@/components/ItemList/ItemCard.vue";

export default {
	name: "ItemGrid",

	components: {
		ItemCard,
	},

	props: {
		items: Array,
		loading: Boolean,
	},
}
</script>
