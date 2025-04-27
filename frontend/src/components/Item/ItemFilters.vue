<template>
<div class="@container filter-area-container controls-bg">
	<div class="flex flex-row flex-wrap @2xl:flex-nowrap gap-1">
		<div class="w-full">
			<TextInput
				type="text"
				size="sm"
				variant="outline"
				placeholder="Search by Item Name"
				:debounce="150"
				v-model="this.filters.txt"
			/>
		</div>

		<div v-if="is_mobile" class="w-full">
			<CustomerSelection ref="customer_selection" />
		</div>

		<div class="w-full">
			<Autocomplete
				:options="this.item_group_options"
				v-model="this.filters.item_group"
				placeholder="Filter by Item Group"
				variant="outline"
			/>
		</div>

		<div class="w-full" v-if="item_sub_group_options.length">
			<Autocomplete
				:options="item_sub_group_options"
				v-model="filters.item_sub_group"
				placeholder="Filter by Sub Group"
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
			@click="this.debounced_reset_filters"
			class="min-w-18"
		/>
	</div>
</div>
</template>

<script>
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import {is_mobile} from "@/utils/responsive";
import {Autocomplete, Button, TextInput} from "frappe-ui";
import {active_brands, active_item_groups, get_item_group_descendants, in_item_group} from "@/data/items";
import debounce from "frappe-ui/src/utils/debounce"

export default {
	name: "ItemFilters",

	components: {
		Autocomplete,
		TextInput,
		Button,
		CustomerSelection
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

		item_sub_group_options() {
			if (this.filters.item_group) {
				let descendants = get_item_group_descendants(this.filters.item_group.value);
				return this.item_group_options.filter(d => {
					return descendants.includes(d.value);
				});
			}

			return [];
		},

		brand_options() {
			return (active_brands.value || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},

		is_mobile() {
			return is_mobile.value;
		},
	},

	watch: {
		'filters.item_group': {
			handler() {
				if (this.filters?.item_sub_group?.value) {
					if (!in_item_group(this.filters.item_sub_group.value, this.filters.item_group.value)) {
						this.filters.item_sub_group = null;
					}
				}
			}
		}
	},
}
</script>
