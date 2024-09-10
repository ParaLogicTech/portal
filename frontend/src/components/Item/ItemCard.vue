<template>
	<div
		class="card item-card clickable @container"
		:class="{'selected': selected}"
		@click="this.handle_click"
		@dblclick="this.handle_double_click"
	>
		<!-- Top Right Common -->
		<div
			class="card-top-right"
			:class="{'!top-[5px]': view_type == 'List View', '!right-[5px]': view_type == 'List View'}"
		>
			<ItemCartStatus
				v-if="view_type != 'List View'"
				:item="item"
			/>
			<Spinner
				v-if="is_in_cart_queue"
				class="w-5"
			/>
		</div>

		<!-- List View Version -->
		<div
			v-show="view_type == 'List View'"
			class="flex h-full"
		>
			<!-- Left Side Image -->
			<ItemImage
				:item="item"
				:enable_full_view="true"
				class="w-[120px] @lg:w-[150px] @2xl:w-[170px] min-h-[110px] max-h-[140px] flex-none"
				rounded="rounded rounded-r-none"
				font="text-3xl"
				object_fit="object-contain"
			/>

			<!-- Right Side Container -->
			<div class="flex flex-col w-full h-full card-separator-x">
				<!-- Item Name Container -->
				<h1 class="text-[11.5px] @lg:text-sm !font-medium px-2 py-1.5 @lg:py-2 bg-gray-50 rounded-tr">
					<HighlightedMatchText
						:text="item.item_name"
						:matches="item_name_matches"
					/>
				</h1>

				<!-- The rest -->
				<div class="flex flex-col justify-between h-full">
					<div class="flex justify-between card-separator-y h-full">
						<!-- Qty -->
						<div class="flex flex-col justify-center gap-0.5 px-2 @lg:px-2.5 py-2">
							<div class="text-2xs font-semibold text-gray-600">Order Qty</div>
							<QtyField
								v-model:qty="qty"
								v-model:uom="uom"
								:uoms="uoms"
								class="h-[28px]"
								ref="qty_field"
								@change="handle_qty_change"
								@arrow-up="handle_arrow_up"
								@arrow-down="handle_arrow_down"
								@focus="handle_qty_focused"
								@blur="handle_qty_blurred"
								@click.stop
							/>
						</div>

						<!-- In Cart Indicator -->
						<div class="p-2">
							<ItemCartStatus
								:item="item"
								:hide_qty="true"
							/>
						</div>
					</div>

					<!-- Stock and Price Footer -->
					<div class="flex justify-between items-center py-2 px-2 @lg:px-2.5 card-separator-y">
						<ItemStock :item="item" class="text-2xs @lg:text-xs self-start flex-none" />
						<ItemPrice :item="item" class="text-sm @lg:text-md" />
					</div>
				</div>
			</div>
		</div>

		<!-- Grid View Version -->
		<div
			v-show="view_type != 'List View'"
			class="flex flex-col h-full"
		>
			<!-- Top Image -->
			<ItemImage
				:item="item"
				:enable_full_view="true"
				class="h-[200px] @3xs:h-[220px] flex-none"
				rounded="rounded rounded-b-none"
				object_fit="object-contain"
			/>

			<div class="flex flex-col justify-between h-full card-separator-y">
				<!-- Item Name -->
				<h1 class="text-[11.5px] @3xs:text-sm font-medium py-2 @3xs:py-2.5 px-2.5 @3xs:px-3">
					<HighlightedMatchText
						:text="item.item_name"
						:matches="item_name_matches"
					/>
				</h1>

				<!-- Bottom stock and price -->
				<div class="flex flex-nowrap gap-1 justify-between items-center py-2 @3xs:py-2.5 px-2.5 @3xs:px-3 card-separator-y">
					<ItemStock :item="item" class="text-2xs @3xs:text-xs self-start flex-none" />
					<ItemPrice :item="item" class="text-sm @3xs:text-md flex-col !items-end" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ItemImage from "@/components/Item/ItemImage.vue";
import HighlightedMatchText from "@/components/Utils/HighlightedMatchText.vue";
import ItemStock from "@/components/Item/ItemStock.vue";
import ItemPrice from "@/components/Item/ItemPrice.vue";
import {cart} from "@/data/cart";
import QtyField from "@/components/Fields/QtyField.vue";
import ItemCartStatus from "@/components/Item/ItemCartStatus.vue";

export default {
	name: "ItemCard",

	components: {
		ItemCartStatus,
		ItemImage,
		HighlightedMatchText,
		ItemStock,
		ItemPrice,
		QtyField,
	},

	data() {
		return {
			qty: 0,
			uom: "Box",
			selected: false,
		}
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
		cart_doc: {
			type: Object,
			required: true,
		},
		view_type: {
			type: String,
			default: "Grid View",
		},
		matches: Array,
	},

	methods: {
		refresh_view() {
			this.qty = this.cart_qty;
			this.uom = this.cart_uom;
			this.$nextTick(() => this.$refs.qty_field?.refresh());
		},

		handle_click() {
			if (this.view_type == "List View") {
				this.focus_qty();
			} else {
				this.$emit('item-selected', this.item, false);
			}
		},

		focus_qty(center) {
			let block = center ? "center" : "nearest";
			this.$el.scrollIntoView({behavior: "instant", block: block});
			this.$refs.qty_field?.focus();
		},

		handle_double_click() {
			this.$emit('item-selected', this.item, true);
		},

		handle_qty_change() {
			this.$emit("qty-changed", this.item, this.qty, this.uom);
		},

		handle_arrow_up() {
			this.$emit("select-previous-row", this.item);
		},

		handle_arrow_down() {
			this.$emit("select-next-row", this.item);
		},

		handle_qty_focused() {
			this.selected = true;
		},

		handle_qty_blurred() {
			this.selected = false;
		},
	},

	computed: {
		item_name_matches() {
			return (this.matches || []).filter(d => d.key == "item_name")[0] || {};
		},

		cart_qty() {
			return flt(this.cart_row?.qty);
		},

		cart_uom() {
			return this.cart_row?.uom || this.uoms[0] || "";
		},

		cart_row() {
			return (this.cart_doc?.items || []).find(d => d.item_code == this.item.name);
		},

		uoms() {
			return (this.item?.uoms || []).map(d => d.uom);
		},

		is_in_cart_queue() {
			return !!cart.items_in_queue.find(item_code => item_code == this.item.name);
		},
	}
}
</script>
