<template>
	<div
		v-if="column.key == 'idx'"
		class="text-xs font-normal"
	>
		{{ row.idx }}
	</div>
	<div
		v-else-if="column.key == 'item_name'"
		class="flex items-center gap-2 h-[45px] overflow-hidden text-gray-900 text-2xs @4xl:text-sm"
	>
		<ItemImage
			:item="item"
			class="w-[45px] h-[45px] flex-none border border-gray-200"
			rounded="rounded"
			font="text-xs"
		/>
		<div class="text-ellipsis">{{ row.item_name }}</div>
	</div>
	<div v-else-if="column.key == 'qty' && editable">
		<QtyField
			v-model:qty="row.qty"
			v-model:uom="row.uom"
			:uoms="uoms"
			class="h-[35px]"
			ref="qty_field"
			@arrow-up="handle_arrow_up('qty')"
			@arrow-down="handle_arrow_down('qty')"
			@change="handle_qty_change"
		/>
	</div>
	<div
		v-else-if="column.key == 'qty' && !editable"
		class="flex items-center justify-end text-right text-base h-[45px] overflow-hidden"
	>
		{{ formatted_value }}
	</div>
	<div v-else-if="column.key == 'rate' && editable">
		<CurrencyField
			v-model="row.rate"
			:currency="doc.currency"
			class="h-[35px]"
			ref="rate_field"
			@arrow-up="this.handle_arrow_up('rate')"
			@arrow-down="this.handle_arrow_down('rate')"
			@update:modelValue="(v) => this.handle_value_change('rate', v)"
		/>
	</div>
	<div v-else-if="column.key == 'discount_percentage' && editable">
		<PercentField
			v-model="row.discount_percentage"
			class="h-[35px]"
			ref="discount_percentage_field"
			@arrow-up="this.handle_arrow_up('discount_percentage')"
			@arrow-down="this.handle_arrow_down('discount_percentage')"
			@update:modelValue="(v) => this.handle_value_change('discount_percentage', v)"
		/>
	</div>
	<div v-else-if="column.key == 'actions'" class="flex items-center justify-end text-xs">
		<ReorderItemButton
			:item="this.item"
			class="p-1 h-[26px] w-[26px]"
		/>
	</div>
	<ListRowItem
		v-else
		:column="column"
		:row="row"
		:item="formatted_value"
		:align=align
	/>
</template>

<script>
import QtyField from "@/components/Fields/QtyField.vue";
import {ListRowItem} from "frappe-ui";
import {item_list} from "@/data/items";
import ItemImage from "@/components/Item/ItemImage.vue";
import CurrencyField from "@/components/Fields/CurrencyField.vue";
import PercentField from "@/components/Fields/PercentField.vue";
import {settings} from "@/data/settings";
import ReorderItemButton from "@/components/Order/ReorderItemButton.vue";

export default {
	name: "OrderRowItem",

	components: {
		ReorderItemButton,
		PercentField,
		CurrencyField,
		ItemImage,
		ListRowItem,
		QtyField,
	},

	props: {
		doc: Object,
		column: Object,
		row: Object,
		value: [String, Number, Object],
		align: String,
		read_only: Boolean,
	},

	methods: {
		focus_field(field, center=false) {
			let ref = field + "_field";
			if (!this.$refs[ref]) {
				return;
			}
			let block = center ? "center" : "nearest";
			this.$el.scrollIntoView({behavior: "instant", block: block, inline: block});
			this.$refs[ref].focus?.();
		},

		refresh_view() {
			this.$refs.qty_field?.refresh();
			this.$refs.rate_field?.refresh();
			this.$refs.discount_percentage_field?.refresh();
		},

		handle_arrow_up(field) {
			this.$emit("select-previous-row", this.row, field);
		},

		handle_arrow_down(field) {
			this.$emit("select-next-row", this.row, field);
		},

		handle_qty_change() {
			this.$emit("qty-changed", this.row);
		},

		handle_value_change(field, value) {
			this.$emit("value-changed", this.row, field, value);
		},
	},

	computed: {
		item() {
			return item_list.dataMap[this.row.item_code] || {};
		},

		uoms() {
			return (this.item?.uoms || []).map(d => d.uom);
		},

		formatted_value() {
			if (["price_list_rate", "rate", "amount"].includes(this.column.key)) {
				let value = this.value;
				if (this.column.key == "price_list_rate" && this.row.rate_with_margin) {
					value = this.row.rate_with_margin;
				}
				return format_currency(value, this.doc.currency);
			} else if (this.column.key == "discount_percentage") {
				return format_number(this.value, null, 1) + "%";
			} else if (this.column.key == "qty") {
				return format_number(this.value, null, 2) + " " + this.row.uom;
			} else {
				return cstr(this.value);
			}
		},

		editable() {
			if (this.read_only) {
				return false;
			}

			if (
				["price_list_rate", "rate", "discount_percentage"].includes(this.column.key)
				&& !settings.value.is_system_user
			) {
				return false;
			}

			return true;
		},
	},
}
</script>
