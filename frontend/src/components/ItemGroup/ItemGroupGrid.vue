<template>
	<div class="@container p-3 overflow-y-scroll">
		<div v-if="loading && !has_data" class="h-full flex items-center justify-center text-gray-700 text-xl">
			<Spinner class="w-5 mr-2" />
			<span>Loading Item Groups...</span>
		</div>

		<div
			v-else-if="!item_groups?.length"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
		>
			<CircleSlash class="h-5 w-5 mr-2" />
			<div>No Item Groups Found</div>
		</div>

		<div v-else class="grid @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5 gap-3">
			<ItemGroupCard
				v-for="d in item_groups"
				:key="d.name"
				:item_group="d"
				:matches="get_matches(d)"
				@item-group-selected="this.handle_item_group_selected"
			/>
		</div>
	</div>
</template>

<script>
import ItemGroupCard from "@/components/ItemGroup/ItemGroupCard.vue";
import {CircleSlash} from "lucide-vue-next";

export default {
	name: "ItemGroupGrid",

	components: {
		CircleSlash,
		ItemGroupCard,
	},

	props: {
		item_groups: Array,
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
	},

	methods: {
		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		handle_item_group_selected(item_group) {
			this.$emit('item-group-selected', item_group);
		}
	}
}
</script>
