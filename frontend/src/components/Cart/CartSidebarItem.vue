<template>
	<div
		class="flex border-b border-gray-400 p-2 gap-2 transition-bg duration-100 ease-in-out"
		:class="selected_class"
		@click="this.select_row"
	>
		<ItemImage
			:item="item"
			class="w-[65px] h-[65px] flex-shrink-0 border border-gray-300"
			rounded="rounded"
			font="text-md"
		/>

		<div class="flex flex-col justify-between w-full">
			<div class="text-sm font-semibold">{{ row.item_name }}</div>
			<div class="flex justify-between gap-0.5">
				<div class="w-[55%] self-end">
					<div class="text-md h-[30px]">
						<input
							v-model="row.qty"
							class="h-full w-[50px] px-0.5 py-0 remove-arrow text-sm font-medium text-center rounded-sm border-gray-400"
							@change="this.handle_qty_change"
							@keydown="this.handle_qty_keydown"
							@input="this.handle_qty_input"
							@focus="this.handle_qty_focus"
							@blur="this.handle_qty_blur"
							type="number"
							inputmode="numeric"
							pattern="[0-9]+([\.,][0-9]+)?"
							ref="qty_input"
							min="0"
						/>
						<select
							v-model="row.uom"
							class="h-full w-[60px] px-1 py-0 remove-arrow text-xs font-medium ml-0.5 rounded-sm border-gray-400 text-gray-800"
							disabled="disabled"
						>
							<option>{{ row.uom }}</option>
						</select>
					</div>
				</div>
				<div class="w-[22%]">
					<div class="text-2xs font-semibold text-gray-600">Rate</div>
					<div class="text-md">${{ row.rate }}</div>
				</div>
				<div class="w-[22%] text-right">
					<div class="text-2xs font-semibold text-gray-600">Amount</div>
					<div class="text-md font-semibold">${{ row.amount }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {item_list} from "@/data/items";
import ItemImage from "@/components/ItemList/ItemImage.vue";
import {debounce} from "frappe-ui";

export default {
	name: "CartSidebarItem",
	components: {ItemImage},

	props: {
		row: Object,
	},

	data() {
		return {
			qty_change_timeout: null,
			selected: false,
		}
	},

	methods: {
		handle_qty_change() {
			this.debounced_qty_changed(250);
		},

		handle_qty_input() {
			this.debounced_qty_changed(1000);
		},

		handle_qty_keydown(e) {
			if (e.code == "ArrowUp") {
				e.preventDefault();
				this.$emit("select-previous-row", this.row);
			} else if (e.code == "ArrowDown") {
				e.preventDefault();
				this.$emit("select-next-row", this.row);
			}
		},

		debounced_qty_changed(wait) {
			wait = wait || 250;
			this.clear_timeout();
			this.qty_change_timeout = setTimeout(this.trigger_qty_changed, wait || 250);
		},

		trigger_qty_changed() {
			this.clear_timeout();
			this.$emit('qty-changed', this.row);
		},

		clear_timeout() {
			if (this.qty_change_timeout) {
				clearTimeout(this.qty_change_timeout);
				this.qty_change_timeout = null;
			}
		},

		select_row() {
			this.$refs.qty_input?.focus();
		},

		handle_qty_focus() {
			this.select_qty_input();
			this.selected = true;
		},

		handle_qty_blur() {
			this.selected = false;
		},

		select_qty_input() {
			this.$refs.qty_input?.select();
		},
	},

	computed: {
		item() {
			return item_list.dataMap[this.row.item_code] || {};
		},

		selected_class() {
			return this.selected ? "bg-yellow-100" : "";
		}
	},
}
</script>

<style scoped>
	.remove-arrow::-webkit-inner-spin-button,
	.remove-arrow::-webkit-outer-spin-button {
		appearance: none;
		margin: 0;
	}
	.remove-arrow {
		appearance: none;
		background-position: right 0.1rem center;
	}
</style>
