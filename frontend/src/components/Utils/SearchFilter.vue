<template>
	<div class="@container filter-area-container top-bar-height controls-bg">
		<div class="flex flex-row flex-wrap @xs:flex-nowrap gap-1">
			<div class="w-full">
				<TextInput
					type="text"
					size="sm"
					variant="outline"
					:placeholder="this.placeholder"
					:debounce="150"
					v-model="this.filters.txt"
				/>
			</div>
			<Button
				variant="outline"
				theme="gray"
				size="sm"
				label="Reset"
				icon-left="filter"
				:disabled="false"
				:link="null"
				:loading="false"
				:loadingText="null"
				@click="this.debounced_reset_filters"
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
		filters: Object,
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
	},
}
</script>
