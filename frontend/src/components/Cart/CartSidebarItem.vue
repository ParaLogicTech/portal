<template>
	<div class="w-full border-b border-gray-400 relative">
		<div
			class="flex p-2 gap-2 w-full bg-white relative z-20 transition-all duration-200 ease"
			:class="selected_class"
			:style="{ 'margin-left': this.margin_left }"
			@click="this.select_row(false)"
			@focusin="this.handle_focusin"
			@touchstart="this.handle_pointer_start"
			@touchmove="this.handle_pointer_move"
			@touchend="this.handle_pointer_end"
			ref="cart_item"
		>
			<ItemImage
				:item="item"
				class="w-[65px] h-[65px] flex-none border border-gray-300"
				rounded="rounded"
				font="text-md"
			/>

			<div class="flex flex-col justify-between w-full">
				<div class="text-sm font-semibold">{{ row.item_name }}</div>
				<div class="flex justify-between gap-1.5">
					<div class="min-w-[40%] self-end">
						<QtyField
							v-model:qty="qty_model.qty"
							v-model:uom="qty_model.uom"
							:uoms="uoms"
							class="h-[30px]"
							ref="qty_field"
							@arrow-up="this.handle_arrow_up"
							@arrow-down="this.handle_arrow_down"
							@focus="this.handle_qty_focused"
							@blur="this.handle_qty_blurred"
							@change="this.handle_qty_change"
						/>
					</div>
					<div class="basis-[25%]">
						<div class="text-2xs font-semibold text-gray-600">Rate</div>
						<div class="text-md text-[13.5px]">{{ format_currency(row.rate, cart.currency) }}</div>
					</div>
					<div class="basis-[35%] text-right">
						<div class="text-2xs font-semibold text-gray-600">Amount</div>
						<div class="text-md font-semibold text-[13.5px]">{{ format_currency(row.amount, cart.currency) }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Trash Icon -->
		<div
			class="pe-4 absolute top-0 right-0 h-full bg-red-500 w-full flex items-center justify-end z-10 hover:bg-red-600 transition-bg duration-200 ease cursor-pointer" 
			@click="this.handle_cart_item_trash"
		>
			<Trash2 class="text-white"/>
		</div>
	</div>
</template>

<script>
import {Trash2} from 'lucide-vue-next';
import ItemImage from "@/components/Item/ItemImage.vue";
import QtyField from "@/components/Fields/QtyField.vue";
import {item_list} from "@/data/items";
import {cart} from "@/data/cart";

export default {
	name: "CartSidebarItem",

	components: {
		QtyField,
		ItemImage,
		Trash2
	},

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

			/* Used for cart item moved element */
			start_x: null,
			current_x: null,
			margin_left: null
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

		handle_pointer_start(e) {
			this.start_x = e.touches[0].clientX;
			this.current_x = this.start_x;
		},

		handle_pointer_move(e) {
			this.current_x = e.touches[0].clientX;
			const deltaX = this.current_x - this.start_x;
			// Set Max Enough to trigger touch
			const threshold = 15;

			if (deltaX < threshold) {
				this.margin_left = `${Math.min(Math.max(deltaX, -55), 0)}px`;
			} else if (deltaX > threshold) {
				this.margin_left = "0"
			}
		},

		handle_pointer_end() {
			// Snap back if not swipe enough
			if(this.margin_left < "-55px") {
				this.margin_left = "0"
			}
		},

		handle_cart_item_trash() {
			cart.update_item_qty(this.row.item_code, 0)
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
		},

		refresh_view() {
			this.qty_model.qty = this.row.qty;
			this.qty_model.uom = this.row.uom;
			this.$refs.qty_field?.refresh();
		},
	},

	computed: {
		item() {
			return item_list.dataMap[this.row.item_code] || {};
		},

		uoms() {
			return (this.item?.uoms || []).map(d => d.uom);
		},

		selected_class() {
			return this.selected ? "bg-yellow-100" : "";
		},
	},

	created() {
		this.$watch(() => cart.loading, () => {
			if (!cart.loading) {
				this.refresh_view();
			}
		})
	}
}
</script>
