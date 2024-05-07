<template>
	<div class="@container filter-area-container top-bar-height controls-bg">
		<div class="flex flex-row flex-wrap @2xl:flex-nowrap gap-1">
			<div class="w-full">
				<CustomerSelection/>
			</div>

			<div class="w-full">
				<TextInput
					type="text"
					size="sm"
					variant="outline"
					placeholder="Order ID"
					v-model="filters.name"
					@update:modelValue="emit_change"
				/>
			</div>

			<div class="w-full">
				<Autocomplete
					:options="this.sales_person_options"
					v-model="this.filters.sales_person"
					placeholder="Sales Person"
					variant="outline"
					@update:modelValue="emit_change"
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
				@click="reset_filters"
			/>

			<Button
				variant="outline"
				theme="gray"
				size="sm"
				label="Reload"
				icon-left="refresh"
				:disabled="false"
				:link="null"
				:loading="loading"
				:loadingText="null"
				@click="emit_reload"
			>
				<template #prefix>
					<RefreshCw class="h-[15px] w-[15px]" stroke-width="1.7px" />
				</template>
			</Button>
		</div>
	</div>
</template>

<script>
import {TextInput, Button, Autocomplete} from "frappe-ui";
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import {RefreshCw} from "lucide-vue-next";
import {active_sales_persons} from "@/data/sales_persons";

export default {
	name: "OrderFilters",

	props: {
		filters: Object,
		loading: Boolean,
	},

	components: {
		CustomerSelection,
		TextInput,
		Button,
		RefreshCw,
		Autocomplete,
	},

	methods: {
		reset_filters() {
			for (let k of Object.keys(this.filters)) {
				this.filters[k] = null;
			}
			this.$emit("reload");
		},

		emit_change() {
			this.$emit("update:filters", this.filters);
		},

		emit_reload() {
			this.$emit("reload");
		},
	},

	computed: {
		sales_person_options() {
			return (active_sales_persons.value || []).map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},
	}
}
</script>
