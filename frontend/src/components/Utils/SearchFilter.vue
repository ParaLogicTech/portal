<template>
	<div class="@container filter-area-container controls-bg">
		<div class="flex flex-row flex-wrap @xs:flex-nowrap gap-1">
			<div class="w-full">
				<TextInput
					type="text"
					size="sm"
					variant="outline"
					:placeholder="placeholder || 'Search'"
					:debounce="150"
					v-model="filters.txt"
					ref="search_input"
				/>
			</div>
			<Button
				variant="outline"
				theme="gray"
				size="sm"
				label="Reset"
				icon-left="filter"
				@click="debounced_reset_filters"
				class="min-w-18"
			/>
		</div>
	</div>
</template>

<script>
import {TextInput, Button} from "frappe-ui";
import debounce from "frappe-ui/src/utils/debounce";

export default {
	name: "SearchFilter",

	data() {
		return {
			debounced_reset_filters: debounce(this.reset_filters, 150),
		}
	},

	props: {
		filters: {
			type: Object,
			required: true,
		},
		placeholder: String
	},

	components: {
		TextInput,
		Button,
	},

	methods: {
		reset_filters() {
			for (let k of Object.keys(this.filters)) {
				this.filters[k] = null;
			}
		},

		focus_search() {
			this.$refs.search_input?.$refs.inputRef?.focus();
		}
	},
}
</script>
