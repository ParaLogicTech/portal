<template>
	<div>
		<div
			v-if="is_empty"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium"
		>
			<CircleSlash class="h-5 w-5 mr-2" />
			<div>Order is empty</div>
		</div>

		<CompactOrderItem
			v-else
			v-for="row in items"
			:row="row"
			:doc="doc"
			:key="row.name || row.item_code"
			@select-next-row="select_next_row"
			@select-previous-row="select_previous_row"
			@qty-changed="handle_qty_change"
			@item-removed="handle_item_removed"
			ref="items"
		/>
	</div>
</template>

<script>
import {CircleSlash} from "lucide-vue-next";
import CompactOrderItem from "@/components/Order/CompactOrderItem.vue";

export default {
	name: "CompactOrderItemsList",

	components: {CompactOrderItem, CircleSlash},

	props: {
		doc: Object,
	},

	methods: {
		select_item(item_code) {
			this.select_row(this.get_row_by_item_code(item_code), true);
		},

		select_next_row(current_row) {
			this.select_row(this.get_next_row(current_row));
		},

		select_previous_row(current_row) {
			this.select_row(this.get_previous_row(current_row));
		},

		get_row_by_item_code(item_code) {
			return this.items.find(d => d.item_code === item_code);
		},

		get_next_row(current_row) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.items.length) {
				return this.items[current_row_idx + 1];
			}
		},

		get_previous_row(current_row) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx - 1 >= 0) {
				return this.items[current_row_idx - 1];
			}
		},

		select_row(row, center=false) {
			if (row) {
				(this.$refs["items"] || []).find(d => d.row == row)?.select_row(center);
			}
		},

		handle_item_removed(row) {
			this.$emit("item-removed", row);
			this.emit_update();
		},

		handle_qty_change(row) {
			this.$emit("qty-changed", row);
			this.emit_update();
		},

		refresh_view() {
			for (let d of this.$refs["items"] || []) {
				d.refresh_view();
			}
		},

		emit_update() {
			this.$emit('update:doc', this.doc);
		},
	},

	computed: {
		is_empty() {
			return !this.items?.length;
		},

		items() {
			return this.doc?.items || [];
		},
	}
}
</script>
