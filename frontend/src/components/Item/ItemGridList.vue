<template>
	<GridListView
		:has_data="has_data"
		:loading="loading"
		:is_empty="!items?.length"
		:view_type="view_type"
		loding="Loading Items..."
		empty_message="No Items Found"
	>
		<ItemCard
			v-for="d in items"
			:key="d.name"
			:item="d"
			:cart_doc="cart_doc"
			:matches="get_matches(d)"
			:view_type="view_type"
			@item-selected="handle_item_selected"
			@qty-changed="handle_qty_change"
			@select-next-row="select_next_row"
			@select-previous-row="select_previous_row"
			ref="items"
		/>
	</GridListView>
</template>

<script>
import ItemCard from "@/components/Item/ItemCard.vue";
import GridListView from "@/components/Utils/GridListView.vue"
import CompactOrderItem from "@/components/Order/CompactOrderItem.vue";
import SelectableItems from "@/mixins/SelectableItems";

export default {
	name: "ItemGridList",

	mixins: [SelectableItems],

	components: {
		CompactOrderItem,
		ItemCard,
		GridListView,
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
		view_type: String,
	},

	methods: {
		refresh_view() {
			for (let d of this.$refs.items || []) {
				d.refresh_view();
			}
		},

		select_next_row(current_item) {
			this.focus_item(this.get_next_row(current_item));
		},

		select_previous_row(current_item) {
			this.focus_item(this.get_previous_row(current_item));
		},

		focus_item(item, center=false) {
			if (item) {
				(this.$refs["items"] || []).find(d => d.item == item)?.focus_qty(center);
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
	}
}
</script>
