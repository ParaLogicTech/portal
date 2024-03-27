<template>
	<div class="@container p-2">
		<div class="flex flex-row w-full mb-2 flex-wrap @xl:flex-nowrap gap-1">
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

		<ItemGrid :items="this.filtered_items" />
	</div>
</template>

<script>
import ItemGrid from "@/components/ItemList/ItemGrid.vue";
import { item_list, item_group_list, brand_list } from "@/data/items";
import debounce from "frappe-ui/src/utils/debounce"

export default {
	name: "ItemList",

	data() {
		return {
			filters: {
				txt: null,
				item_group: null,
				brand: null,
			},
			debounced_reset_filters: debounce(this.reset_filters, 150),
		}
	},

	methods: {
		reset_filters() {
			for (let k of Object.keys(this.filters)) {
				this.filters[k] = null;
			}
		},

		get_clean_txt() {
			let txt = this.filters.txt || "";
			return txt.toString().trim();
		},
	},

	computed: {
		item_group_options() {
			return item_group_list.data.map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},

		brand_options() {
			return brand_list.data.map(d => {
				return {
					label: d.name,
					value: d.name,
				}
			});
		},

		filtered_items() {
			let items = item_list.data;

			if (this.filters.item_group?.value) {
				items = items.filter(d => d.item_group === this.filters.item_group.value);
			}

			if (this.filters.brand?.value) {
				items = items.filter(d => d.brand === this.filters.brand.value);
			}

			let txt = this.get_clean_txt();
			if (txt) {
				items = items.filter(d => {
					return (
						d.item_name.toLowerCase().includes(txt.toLowerCase())
						|| d.name.toLowerCase().includes(txt.toLowerCase())
					)
				});
			}

			return items;
		}
	},

	components: {
		ItemGrid,
	}
}
</script>
