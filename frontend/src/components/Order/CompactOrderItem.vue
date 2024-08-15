<template>
	<div
		class="w-full overflow-x-hidden flex h-[81px]"
		:class="border_classes"
		@touchstart="this.handle_touch_start"
		@touchmove="this.handle_touch_move"
		@touchend="this.handle_touch_end"
	>
		<!-- Slidable Row -->
		<div
			class="flex p-2 gap-2 w-full transition-bg duration-100 ease relative"
			:class="selected_class"
			:style="{ 'margin-left': `${-this.slide}px` }"
			@click="this.select_row(false)"
			@focusin="this.handle_focusin"
		>
			<!-- Menu -->
			<div
				v-if="!read_only"
				class="absolute top-0.5 right-0.5"
			>
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
					<template #body="{ close }">
						<div class="bg-white border border-gray-300 rounded shadow-sm p-0.5">
							<Button
								variant="ghost"
								theme="red"
								size="sm"
								label="Remove"
								@click="this.handle_remove_button(); close();"
							>
								<template #prefix>
									<Trash2 class="h-[15px] w-[15px]" />
								</template>
							</Button>
						</div>
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
				<div class="text-sm font-semibold pr-1">{{ row.item_name }}</div>

				<div class="flex justify-between gap-1.5">
					<div class="min-w-[40%] self-end">
						<div v-if="read_only">
							<div class="text-2xs font-semibold text-gray-600">Qty</div>
							<div class="text-md text-[13.5px]">{{ format_number(row.qty, null, 2) }} {{ row.uom }}</div>
						</div>
						<QtyField
							v-else
							v-model:qty="row.qty"
							v-model:uom="row.uom"
							:uoms="uoms"
							class="h-[30px] compact-qty-field"
							ref="qty_field"
							@arrow-up="handle_arrow_up"
							@arrow-down="handle_arrow_down"
							@focus="handle_qty_focused"
							@blur="handle_qty_blurred"
							@change="handle_qty_change"
							@click.stop
						/>
					</div>

					<div class="basis-[25%]">
						<div class="text-2xs font-semibold text-gray-600">Rate</div>
						<div class="text-md text-[13.5px]">{{ format_currency(row.rate, doc.currency) }}</div>
					</div>

					<div class="basis-[35%] text-right">
						<div class="text-2xs font-semibold text-gray-600">Amount</div>
						<div class="text-md font-semibold text-[13.5px]">{{ format_currency(row.amount, doc.currency) }}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Hidden Trash Icon -->
		<button
			class="h-full bg-red-500 hover:bg-red-600 flex flex-none items-center justify-center transition-bg duration-200 ease"
			tabindex="-1"
			@click="this.handle_remove_button"
			:style="{
				'margin-right': `${-drawer_width}px`,
				width: `${drawer_width}px`,
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
import {Popover, Button} from "frappe-ui";

export default {
	name: "CompactOrderItem",

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
		doc: Object,
		read_only: Boolean,
		border_color_class: String,
		no_last_border: Boolean,
	},

	data() {
		return {
			selected: false,
			popover: false,

			/* Slidable drawer */
			slide_threshold: 20,
			drawer_width: 65,
			start_x: null,
			slide: 0
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
			if (this.read_only) {
				this.reset_slide();
				return;
			}
			this.start_x = e.touches[0].clientX;
		},

		handle_touch_move(e) {
			if (this.read_only) {
				this.reset_slide();
				return;
			}
			if (this.start_x == null) {
				return;
			}

			const current_x = e.touches[0].clientX;
			const slide_x = this.start_x - current_x;
			const slide_with_threshold = slide_x - this.slide_threshold;
			this.slide = Math.max(Math.min(slide_with_threshold, this.drawer_width), 0);
		},

		handle_touch_end() {
			if (this.read_only) {
				this.reset_slide();
				return;
			}

			// Snap back if not moved enough
			if(this.slide < this.drawer_width) {
				this.reset_slide();
			} else {
				this.$refs.qty_field?.focus();
			}
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
			setTimeout(() => this.reset_slide(), 100);
		},

		handle_remove_button() {
			this.$emit("item-removed", this.row);
		},

		handle_qty_change() {
			this.$emit("qty-changed", this.row);
		},

		refresh_view() {
			this.$refs.qty_field?.refresh();
		},

		reset_slide() {
			this.slide = 0;
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

		border_classes() {
			let classes = ['border-b', this.border_color_class || 'border-gray-400'];
			if (this.no_last_border) {
				classes.push('last:border-b-0');
			}
			return classes;
		},
	},
}
</script>
