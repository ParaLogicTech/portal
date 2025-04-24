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
				@update:model-value="updateItemSubGroups"
				placeholder="Filter by Item Group"
				variant="outline"
			/>
		</div>

		<div class="w-full" v-if="sub_group_list > 0">
			<Autocomplete
				:options="filtered_sub_groups"
				v-model="filters.item_sub_group"
				placeholder="Filter by Item Sub Group"
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
import {active_brands, active_item_groups} from "@/data/items";
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
			sub_group_list: 0,
			filtered_sub_groups: []
		}
	},
	mounted() {
		// Initializing sub-groups if item_group is already set
		if (this.filters.item_group) {
			this.updateItemSubGroups(this.filters.item_group);
		}
	},
	methods: {
		reset_filters() {
			for (let k of Object.keys(this.filters)) {
				this.filters[k] = null;
			}
			this.sub_group_list = 0;
			this.filtered_sub_groups = [];
		},
		updateItemSubGroups(item_group) {
			if (!item_group) {
				this.sub_group_list = 0;
				this.filtered_sub_groups = [];
				return;
			}
			const group_item = item_group.value || item_group;
			const children = (active_item_groups.value || []).filter(
				group => group.parent_item_group === group_item
			);
			
			this.sub_group_list = children.length;
			this.filtered_sub_groups = children.map(group => ({
				label: group.name,
				value: group.name,
			}));

			if (this.filters.item_sub_group.value && !this.filtered_sub_groups.some(
				option => option.value === this.filters.item_sub_group.value
			)) {
				this.filters.item_sub_group = null;
			}
		}
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

		is_mobile() {
			return is_mobile.value;
		},
	}
}
</script>
