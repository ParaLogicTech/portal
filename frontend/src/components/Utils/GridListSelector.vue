<template>
	<div class="flex items-center grid-list-selector">
		<button
			:class="{selected: view_type == 'Grid View'}"
			title="Grid View"
			@click="set_view('Grid View')"
		>
			<LayoutGrid class="h-[20px]" stroke-width="1.8px" />
		</button>
		<button
			:class="{selected: view_type == 'List View'}"
			title="List View"
			@click="set_view('List View')"
		>
			<LayoutList class="h-[20px]" stroke-width="1.8px" />
		</button>
	</div>
</template>

<script>
import {LayoutGrid, LayoutList, PackageSearch} from "lucide-vue-next";

export default {
	name: "GridListSelector",

	components: {PackageSearch, LayoutList, LayoutGrid},

	props: {
		modelValue: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			view_type: this.modelValue,
		}
	},

	methods: {
		set_view(value) {
			this.view_type = value;
			this.$emit("update:modelValue", value);
		}
	},
}
</script>

<style lang="scss">
	.grid-list-selector {
		button {
			@apply px-2 py-1;
			@apply text-gray-700 bg-white;
			@apply border border-gray-400;
			@apply transition-colors duration-200;
			@apply hover:bg-gray-50 active:bg-gray-200;

			&:first-child {
				@apply rounded-l-sm;
			}
			&:last-child {
				@apply rounded-r-sm;
			}

			&:not(:first-child) {
				@apply border-l-0;
			}
			&:not(:last-child) {
				@apply border-r-0;
			}
			&:not(.selected + button) {
				@apply border-l;
			}

			&.selected {
				@apply bg-blue-200 border-blue-400 text-blue-800 border-r border-l;
			}
		}
	}
</style>
