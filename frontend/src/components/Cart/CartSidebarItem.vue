<template>
	<div
		class="flex border-b border-gray-400 p-2 gap-2 transition-bg duration-100 ease-in-out"
		:class="selected_class"
		@click="this.select_row(false)"
		@focusin="this.handle_focusin"
	>
		<ItemImage
			:item="item"
			class="w-[65px] h-[65px] flex-shrink-0 border border-gray-300 hidden sm:block"
			rounded="rounded"
			font="text-md"
		/>

		<div class="flex flex-col justify-between w-full">
			<div class="text-sm font-semibold">{{ row.item_name }}</div>
			<div class="flex justify-between gap-0.5">
				<div class="w-[55%] self-end">
					<QtyField
						v-model="qty_model"
						class="h-[30px]"
						ref="qty_field"
						@arrow-up="this.handle_arrow_up"
						@arrow-down="this.handle_arrow_down"
						@focus="this.handle_qty_focused"
						@blur="this.handle_qty_blurred"
						@update:modelValue="this.handle_qty_change"
					/>
				</div>
				<div class="w-[22%]">
					<div class="text-2xs font-semibold text-gray-600">Rate</div>
					<div class="text-md">{{ format_currency(row.rate, cart.currency) }}</div>
				</div>
				<div class="w-[22%] text-right">
					<div class="text-2xs font-semibold text-gray-600">Amount</div>
					<div class="text-md font-semibold">{{ format_currency(row.amount, cart.currency) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/ItemList/ItemImage.vue";
import QtyField from "@/components/Fields/QtyField.vue";
import {item_list} from "@/data/items";
import {cart} from "@/data/cart";

export default {
	name: "CartSidebarItem",

	components: {QtyField, ItemImage},

	props: {
		row: Object,
	},

	data() {
		return {
			qty_model: {
				qty: this.row.qty,
				uom: this.row.uom,
			},

			cart: cart,

			selected: false,
		}
	},

	methods: {
		select_row(center=false) {
			let block = center ? "center" : "nearest";
			this.$el.scrollIntoView({behavior: "instant", block: block});
			this.$refs.qty_field?.focus();
		},

		handle_focusin() {
			this.$el.scrollIntoView({behavior: "instant", block: "nearest"});
		},

		handle_arrow_up() {
			this.$emit("select-previous-row", this.row);
		},

		handle_arrow_down() {
			this.$emit("select-next-row", this.row);
		},

		handle_qty_focused() {
			this.selected = true;
		},

		handle_qty_blurred() {
			this.selected = false;
		},

		handle_qty_change() {
			cart.update_item_qty(this.row.item_code, this.qty_model.qty, this.qty_model.uom);
			cart.promise.finally(() => this.reset_qty_model());
		},

		reset_qty_model() {
			this.qty_model.qty = this.row.qty;
			this.qty_model.uom = this.row.uom;
			this.$refs.qty_field?.refresh();
		},
	},

	computed: {
		item() {
			return item_list.dataMap[this.row.item_code] || {};
		},

		selected_class() {
			return this.selected ? "bg-yellow-100" : "";
		},
	},
}
</script>
