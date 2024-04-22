<template>
<div class="@container filter-area-container top-bar-height controls-bg">
	<div class="flex flex-row flex-wrap @xl:flex-nowrap gap-1">
		<div class="w-full">
			<TextInput
				type="text"
				size="sm"
				variant="outline"
				placeholder="Search Items..."
				:debounce="150"
				v-model="this.filters.txt"
			/>
		</div>

		<div class="w-full">
			<Autocomplete
				:options="this.item_group_options"
				v-model="this.filters.item_group"
				placeholder="Filter by Item Group"
				variant="outline"
			/>
		</div>

		<div class="w-full">
			<Autocomplete
				:options="this.brand_options"
				v-model="this.filters.brand"
				placeholder="Filter by Brand"
				variant="outline"
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
import {Autocomplete, Button, TextInput} from "frappe-ui";
import {active_brands, active_item_groups} from "@/data/items";
import debounce from "frappe-ui/src/utils/debounce"

export default {
	name: "ItemFilters",

	components: {
		Autocomplete,
		TextInput,
		Button,
	},

	props: {
		filters: Object,
	},

	data() {
		return {
			debounced_reset_filters: debounce(this.reset_filters, 150),
		}
	},

	methods: {
		reset_filters() {
			for (let k of Object.keys(this.filters)) {
				this.filters[k] = null;
			}
		},
	},

	computed: {
		item_group_options() {
			return (active_item_groups.value || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},

		brand_options() {
			return (active_brands.value || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},
	}
}
</script>
