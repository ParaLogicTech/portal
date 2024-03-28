<template>
<div class="@container py-2 px-3">
	<div class="flex flex-row w-full flex-wrap @xl:flex-nowrap gap-1">
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
import {brand_list, item_group_list} from "@/data/items";
import debounce from "frappe-ui/src/utils/debounce"

export default {
	name: "ItemFilters",

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
			let item_groups = item_group_list.data;
			return (item_groups || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},

		brand_options() {
			let brands = brand_list.data;
			return (brands || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},
	}
}
</script>
