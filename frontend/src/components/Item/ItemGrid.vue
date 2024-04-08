<template>
	<div class="@container p-3 overflow-y-scroll">
		<div v-if="loading && !has_data" class="h-full flex items-center justify-center text-gray-700 text-xl">
			<Spinner class="w-5 mr-2" />
			<span>Loading Items...</span>
		</div>

		<div
			v-else-if="!items?.length"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
		>
			<CircleSlash class="h-5 w-5 mr-2" />
			<div>No Items Found</div>
		</div>

		<div v-else class="grid @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5 gap-3">
			<ItemCard
				v-for="d in items"
				:key="d.name"
				:item="d"
				:matches="get_matches(d)"
				@item-selected="this.handle_item_selected"
			/>
		</div>
	</div>
</template>

<script>
import ItemCard from "@/components/Item/ItemCard.vue";
import {CircleSlash} from "lucide-vue-next"

export default {
	name: "ItemGrid",

	components: {
		ItemCard,
		CircleSlash,
	},

	props: {
		items: Array,
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
	},

	methods: {
		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		handle_item_selected(item) {
			this.$emit('item-selected', item);
		}
	}
}
</script>
