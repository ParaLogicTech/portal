<template>
	<div class="@container p-3 overflow-y-scroll">
		<div
			v-if="!items || !items.length"
			class="min-h-[80px] flex items-center justify-center text-gray-500 text-xl text-bold"
		>
			<FeatherIcon
				name="x"
				class="h-5 w-5 mr-1"
				aria-hidden="true"
			/>
			<div>No Items Found</div>
		</div>

		<div v-else class="grid @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5 gap-3">
			<div v-for="item in items">
				<ItemCard :item="item" />
			</div>
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
	},
}
</script>
