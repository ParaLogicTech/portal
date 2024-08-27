<template>
	<div class="grid-list-group">
		<div
			v-if="$slots.group"
			class="sticky top-0 z-[1]"
		>
			<div class="group-heading">
				<slot
					name="group"
					:group="group"
					:group_field="group_field"
					:group_items="items"
				/>
			</div>
		</div>

		<div :class="grid_classes" class="p-3 gap-3">
			<slot
				v-for="item in items_to_show"
				:item="item"
			/>

			<slot
				name="show_more"
				v-if="has_more"
				:group="group"
				:group_field="group_field"
				:group_items="items"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: "GridListGroup",

	props: {
		group: String,
		group_field: String,
		items: Array,
		view_type: String,
		page_length: Number,
	},

	data() {
		return {
			page_count: 1,
		}
	},

	computed: {
		grid_classes() {
			if (this.view_type == "List View") {
				return "grid grid-cols-1";
			} else {
				return "grid @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @7xl:grid-cols-5";
			}
		},

		items_to_show() {
			if (this.items_count_to_show) {
				return (this.items || []).slice(0, this.items_count_to_show);
			} else {
				return this.items || [];
			}
		},

		items_count_to_show() {
			if (this.page_length) {
				return this.page_length * (this.page_count || 1);
			} else {
				return 0;
			}
		},

		has_more() {
			return this.page_length && (this.items || []).length > this.page_length;
		},
	}
}
</script>

<style lang="scss">
	.grid-list-group {
		@apply border-b border-gray-400;

		.group-heading {
			@apply flex items-center;
			@apply text-lg font-medium;
			@apply bg-white border-b border-gray-400 shadow-sm;
			@apply px-3.5 py-0.5 min-h-[45px];
		}

		&:last-child {
			@apply border-b-0;
		}
	}
</style>
