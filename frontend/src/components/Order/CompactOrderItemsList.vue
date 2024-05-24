<template>
	<div>
		<div
			v-if="is_empty"
			class="h-full flex flex-col items-center justify-center text-gray-400 text-xl font-medium py-5 gap-3"
		>
			<div class="flex gap-2">
				<CircleSlash class="h-5 w-5" />
				<div>Order is empty</div>
			</div>
			<div v-if="show_empty_explore_button">
				<Button
					variant="subtle"
					theme="gray"
					size="sm"
					label="Explore Items"
					@click="this.$router.push({name: 'ItemListView'})"
				/>
			</div>
		</div>

		<CompactOrderItem
			v-else
			v-for="row in items"
			:row="row"
			:doc="doc"
			:key="row.name || row.item_code"
			:read_only="read_only"
			:border_color_class="border_color_class"
			:no_last_border="no_last_border"
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
import {Button} from "frappe-ui";
import SelectableItems from "@/mixins/SelectableItems";

export default {
	name: "CompactOrderItemsList",

	components: {CompactOrderItem, CircleSlash, Button},

	mixins: [SelectableItems],

	props: {
		doc: Object,
		read_only: Boolean,
		show_empty_explore_button: Boolean,
		border_color_class: String,
		no_last_border: Boolean,
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

		select_row(row, center=false) {
			if (row) {
				(this.$refs["items"] || []).find(d => d.row == row)?.select_row(center);
			}
		},

		handle_item_removed(row) {
			this.emit_update();
			this.$emit("item-removed", row);
		},

		handle_qty_change(row) {
			this.emit_update();
			this.$emit("qty-changed", row);
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
