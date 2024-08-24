<template>
	<GridListView
		:items="items"
		:groups="group_list"
		:group_field="group_field"
		:has_data="has_data"
		:loading="loading"
		:view_type="view_type"
		:show_groups="show_groups"
		:group_page_length="group_page_length"
		loding="Loading Items..."
		empty_message="No Items Found"
	>
		<template #default="{item}">
			<ItemCard
				:item="item"
				:key="item.name"
				:cart_doc="cart_doc"
				:matches="get_matches(item)"
				:view_type="view_type"
				@item-selected="handle_item_selected"
				@qty-changed="handle_qty_change"
				@select-next-row="select_next_row"
				@select-previous-row="select_previous_row"
				style="scroll-margin-top: 3.15rem; scroll-margin-bottom: 0.625rem;"
				:ref="collect_item_refs"
			/>
		</template>

		<template #group="{group, group_field}">
			<div class="flex w-full justify-between items-center">
				<div>{{ group }}</div>
				<button
					v-if="group_page_length"
					class="flex items-center gap-1 rounded py-1 px-1.5 text-xs border text-gray-800 border-gray-400 hover:border-gray-800 active:bg-gray-100 transition-colors duration-200"
					@click="select_group(group_field, group)"
				>
					<Eye class="h-[16px] w-[16px]" stroke-width="1.6px" />
					Show All
				</button>
			</div>
		</template>

		<template #show_more="{group, group_field, group_items}">
			<div
				class="card item-card clickable flex flex-col items-center justify-center text-center py-6 px-4 gap-3 bg-yellow-50 text-orange-900"
				@click="select_group(group_field, group)"
			>
				<div class="text-lg font-medium">{{ group_items.length }} {{ group }} Items</div>
				<div class="flex items-center gap-1.5 border border-orange-900 rounded py-1 px-1.5 text-sm">
					<Eye class="h-[17px] w-[17px]" stroke-width="1.6px" /> Show All
				</div>
			</div>
		</template>
	</GridListView>
</template>

<script>
import ItemCard from "@/components/Item/ItemCard.vue";
import GridListView from "@/components/Utils/GridListView.vue"
import CompactOrderItem from "@/components/Order/CompactOrderItem.vue";
import SelectableItems from "@/mixins/SelectableItems";
import {sorted_item_groups, sorted_brands} from "@/data/items";
import {Eye} from "lucide-vue-next";

export default {
	name: "ItemGridList",

	mixins: [SelectableItems],

	components: {
		CompactOrderItem,
		ItemCard,
		GridListView,
		Eye,
	},

	props: {
		items: {
			type: Array,
			required: true,
		},
		cart_doc: {
			type: Object,
			required: true,
		},
		matches: Object,
		loading: Boolean,
		has_data: Boolean,
		show_groups: Boolean,
		group_field: String,
		group_page_length: Number,
		view_type: String,
	},

	data() {
		return {
			item_refs: [],
		}
	},

	methods: {
		refresh_view() {
			for (let d of this.item_refs || []) {
				d.refresh_view();
			}
		},

		select_next_row(current_item) {
			let current_element = this.item_refs.find(d => d?.item === current_item);
			this.focus_item(this.get_next_row(current_element));
		},

		select_previous_row(current_item) {
			let current_element = this.item_refs.find(d => d?.item === current_item);
			this.focus_item(this.get_previous_row(current_element));
		},

		focus_item(element, center=false) {
			if (element) {
				(this.item_refs || []).find(d => d === element)?.focus_qty(center);
			}
		},

		handle_item_selected(item, open_cart) {
			this.$emit('item-selected', item, open_cart);
		},

		handle_qty_change(item, qty, uom) {
			this.$emit('qty-changed', item, qty, uom);
		},

		get_matches(d) {
			return this.matches ? this.matches[d.name] : [];
		},

		select_group(group_field, group) {
			if (group_field == "item_group") {
				this.$emit('item-group-selected', group);
			} else if (group_field == "brand") {
				this.$emit('brand-selected', group);
			}
		},

		collect_item_refs(el) {
			if (el) {
				this.item_refs.push(el);
			}
		},
	},

	computed: {
		group_list() {
			let out = [];

			if (this.group_field == "item_group") {
				out = sorted_item_groups.value.map(d => d.name);
			} else if (this.group_field == "brand") {
				out = sorted_brands.value.map(d => d.name);
			} else {
				out = (items || []).map(d => d[this.group_field]);
			}

			return out;
		},

		selectable_items_elements() {
			return this.item_refs;
		}
	},

	beforeUpdate() {
		this.item_refs = [];
	}
}
</script>
