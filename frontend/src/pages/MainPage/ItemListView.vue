<template>
	<div class="flex flex-col h-full">
		<!-- Title -->
		<div class="flex justify-between top-bar-height controls-bg px-3 py-1 border-b border-gray-400">
			<div class="flex items-center">
				<PackageSearch class="inline h-[19px] text-gray-900" stroke-width="1.6px"/>
				<h1 class="text-xl font-semibold ml-1">Item List</h1>
			</div>

			<GridListSelector v-model="view_type" @update:modelValue="handle_view_type_change" />
		</div>

		<ItemFilters
			:filters="filters"
			class="flex-none border-b border-gray-400 shadow-sm"
			ref="item_filters"
		/>

		<ItemGridList
			:items="filtered_items"
			:cart_doc="model"
			:loading="item_list.list.loading"
			:has_data="item_list.data?.length > 0"
			:matches="fuzzy_matches"
			:view_type="view_type"
			class="h-full"
			@item-selected="this.handle_item_selected"
			@qty-changed="this.handle_qty_change"
			ref="items"
		/>
	</div>
</template>

<script>
import ItemGridList from "@/components/Item/ItemGridList.vue";
import ItemFilters from "@/components/Item/ItemFilters.vue";
import { item_list, active_items, in_item_group } from "@/data/items";
import FuzzySearch from "@/mixins/FuzzySearch";
import {PackageSearch} from "lucide-vue-next";
import GridListSelector from "@/components/Utils/GridListSelector.vue";
import CartController from "@/mixins/CartController";
import {settings} from "@/data/settings";

export default {
	name: "ItemListView",

	components: {
		GridListSelector,
		PackageSearch,
		ItemFilters,
		ItemGridList,
	},

	mixins: [FuzzySearch, CartController],

	data() {
		let view_type = localStorage.getItem('item_list_view_type');
		if (view_type && !['List View', 'Grid View'].includes(view_type)) {
			view_type = null;
		}

		if (!view_type && !settings.value.is_system_user) {
			view_type = settings.value.customer_item_list_view_type;
		}
		if (!view_type) {
			view_type = settings.value.default_item_list_view_type;
		}
		if (!view_type) {
			view_type = "Grid View";
		}

		return {
			filters: {
				txt: null,
				item_group: null,
				brand: null,
			},
			item_list: item_list,
			fuzzy_search_keys: ['item_name', 'name'],
			view_type: view_type,
		}
	},

	computed: {
		filtered_items() {
			let items = this.fuzzy_filtered_items;

			if (this.filters.brand?.value) {
				items = items.filter(d => d.brand === this.filters.brand.value);
			}

			if (this.filters.item_group?.value) {
				items = items.filter(d => in_item_group(d.item_group, this.filters.item_group.value));
			}

			if (!this.filters_applied) {
				items = items.slice(0, 100);
			}

			return items;
		},

		list_data() {
			return active_items.value || [];
		},

		filters_applied() {
			let applied = false;
			for (let v of Object.values(this.filters)) {
				if (v) {
					applied = true;
					break
				}
			}
			return applied;
		},
	},

	methods: {
		async refresh_view() {
			this.refresh_cart_model();
			return this.$nextTick(() => {
				this.$refs.items?.refresh_view();
			});
		},

		handle_item_selected(item, open_cart) {
			this.$emit('item-selected', item, open_cart);
		},

		handle_qty_change(item, qty, uom) {
			this.$emit('qty-changed', item, qty, uom);
		},

		set_item_group_filter(value) {
			if (value) {
				this.filters.item_group = { label: value, value: value };
			} else {
				this.filters.item_group = null;
			}
		},

		set_brand_filter(value) {
			if (value) {
				this.filters.brand = { label: value, value: value };
			} else {
				this.filters.brand = null;
			}
		},

		handle_view_type_change() {
			localStorage.setItem("item_list_view_type", this.view_type);
		},

		toggle_customer_selection(val) {
			this.$refs.item_filters?.toggle_customer_selection(val);
		},
	},
}
</script>
