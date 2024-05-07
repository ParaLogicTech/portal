<template>
	<div
		v-if="column.key == 'item_name'"
		class="flex items-center gap-2.5 h-[45px] overflow-hidden"
	>
		<ItemImage
			:item="item"
			class="w-[45px] h-[45px] flex-none border border-gray-200"
			rounded="rounded"
			font="text-xs"
		/>
		<div class="text-ellipsis">{{ row.item_name }}</div>
	</div>
	<div v-else-if="column.key == 'qty' && !read_only">
		<QtyField
			v-model:qty="row.qty"
			v-model:uom="row.uom"
			:uoms="uoms"
			class="h-[35px]"
			ref="qty_field"
			@arrow-up="this.handle_arrow_up('qty')"
			@arrow-down="this.handle_arrow_down('qty')"
			@change="this.handle_qty_change"
		/>
	</div>
	<div
		v-else-if="column.key == 'qty' && read_only"
		class="flex items-center justify-end text-right text-base h-[45px] overflow-hidden"
	>
		{{ formatted_value }}
	</div>
	<div v-else-if="column.key == 'rate' && !read_only">
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
	<div v-else-if="column.key == 'discount_percentage' && !read_only">
		<PercentField
			v-model="row.discount_percentage"
			class="h-[35px]"
			ref="discount_percentage_field"
			@arrow-up="this.handle_arrow_up('discount_percentage')"
			@arrow-down="this.handle_arrow_down('discount_percentage')"
			@update:modelValue="(v) => this.handle_value_change('discount_percentage', v)"
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

export default {
	name: "OrderRowItem",

	components: {PercentField, CurrencyField, ItemImage, ListRowItem, QtyField},

	props: {
		doc: Object,
		column: Object,
		row: Object,
		value: [String, Number, Object],
		align: String,
		events: Object,
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

		handle_selected(data) {
			if (data.row == this.row) {
				this.focus_field(data.field);
			}
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
				return format_currency(this.value, this.doc.currency);
			} else if (this.column.key == "discount_percentage") {
				return format_number(this.value, null, 1) + "%";
			} else if (this.column.key == "qty") {
				return format_number(this.value, null, 2) + " " + this.row.uom;
			} else {
				return cstr(this.value);
			}
		},
	},

	created() {
		this.events.on('selected', this.handle_selected);
		this.events.on('refreshed', this.refresh_view);
	},
	beforeDestroy() {
		this.events.off('selected', this.handle_selected);
		this.events.off('refreshed', this.refresh_view);
	},
}
</script>
