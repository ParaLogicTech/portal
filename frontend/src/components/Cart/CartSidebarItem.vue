<template>
	<div
		class="w-full border-b border-gray-400 overflow-x-hidden flex h-[81px]"
		@touchstart="this.handle_touch_start"
		@touchmove="this.handle_touch_move"
		@touchend="this.handle_touch_end"
	>
		<div
			class="flex p-2 gap-2 w-full transition-bg duration-100 ease"
			:class="selected_class"
			:style="{ 'margin-left': `${-this.move}px` }"
			@click="this.select_row(false)"
			@focusin="this.handle_focusin"
		>
			<!-- Menu -->
			<div class="absolute top-0.5 right-0.5">
				<Popover>
					<template #target="{ togglePopover }">
						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							@click.stop="togglePopover()"
							class="w-[18px]"
						>
							<EllipsisVertical class="h-[16px]" />
						</Button>
					</template>
					<template #body-main>
						<Button
							variant="ghost"
							theme="red"
							size="sm"
							label="Remove"
							iconLeft="trash"
							@click="this.handle_delete_button"
							class="outline outline-gray-300 outline-1 top-5"
						>
						</Button>
					</template>
				</Popover>
			</div>

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
							@click="(e) => e.stopPropagation()"
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
		<button
			class="h-full bg-red-500 hover:bg-red-600 flex flex-none items-center justify-center transition-bg duration-200 ease"
			@click="this.handle_delete_button"
			:style="{
				'margin-right': `${-delete_icon_width}px`,
				width: `${delete_icon_width}px`,
			}"
		>
			<Trash2 class="text-white h-[45px]"/>
		</button>
	</div>
</template>

<script>
import {Trash2, EllipsisVertical} from 'lucide-vue-next';
import ItemImage from "@/components/Item/ItemImage.vue";
import QtyField from "@/components/Fields/QtyField.vue";
import {item_list} from "@/data/items";
import {cart} from "@/data/cart";
import {Popover, Button} from "frappe-ui";

export default {
	name: "CartSidebarItem",

	components: {
		QtyField,
		ItemImage,
		Trash2,
		EllipsisVertical,
		Popover,
		Button
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
			popover: false,

			/* Used for cart item moved element */
			move_threshold: 20,
			delete_icon_width: 65,
			start_x: null,
			move: 0
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

		handle_touch_start(e) {
			this.start_x = e.touches[0].clientX;
			this.$refs.qty_field?.focus();
		},

		handle_touch_move(e) {
			if (this.start_x == null) {
				return;
			}

			const current_x = e.touches[0].clientX;
			const move_x = this.start_x - current_x;
			const move_with_threshold = move_x - this.move_threshold;
			this.move = Math.max(Math.min(move_with_threshold, this.delete_icon_width), 0);
		},

		handle_touch_end() {
			// Snap back if not moved enough
			if(this.move < this.delete_icon_width) {
				this.reset_move();
			}
		},

		handle_delete_button() {
			cart.update_item_qty(this.row.item_code, 0);
		},

		handle_arrow_up() {
			this.$emit("select-previous-row", this.row);
		},

		handle_arrow_down() {
			this.$emit("select-next-row", this.row);
		},

		handle_qty_focused() {
			this.selected = true;
			this.reset_move();
		},

		handle_qty_blurred() {
			this.selected = false;
			setTimeout(() => this.reset_move(), 100);
		},

		handle_qty_change() {
			cart.update_item_qty(this.row.item_code, this.qty_model.qty, this.qty_model.uom);
		},

		refresh_view() {
			this.qty_model.qty = this.row.qty;
			this.qty_model.uom = this.row.uom;
			this.$refs.qty_field?.refresh();
		},

		reset_move() {
			this.move = 0;
		}
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
