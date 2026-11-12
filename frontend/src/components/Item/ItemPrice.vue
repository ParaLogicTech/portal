<template>
	<div class="flex flex-wrap gap-x-1 items-center justify-end">
		<div
			v-if="output.free_qty"
			class="rounded-sm py-0.5 px-1 mb-0.5 bg-red-500 text-white text-[80%] !font-semibold"
			:class="{'asterisk': output.free_item_conditional}"
		>
			Buy
			{{ output.buy_qty }}
			Get
			{{ output.free_qty }}
			{{ output.free_item_name || "" }}
			Free
		</div>

		<div
			v-if="output.rate_before"
			class="!font-medium !text-[85%] line-through text-gray-600"
		>
			{{ output.rate_before }}
		</div>

		<div class="flex flex-wrap gap-x-1 gap-y-0.5 items-center justify-end">
			<div
				v-if="output.discount"
				class="rounded-sm py-0.5 px-1 bg-red-500 text-white text-[80%] !font-semibold"
			>
				-{{ output.discount }}
			</div>

			<div class="!font-semibold text-violet-900" :class="{'asterisk': output.price_conditional}">
				{{ output.rate }}
			</div>
		</div>
	</div>
</template>

<script>
import {get_item, get_item_prices_resource} from "@/data/items";
import {cart} from "@/data/cart";

export default {
	name: "ItemPrice",

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		output() {
			if (this.item_price_resource.loading && !this.price?.price_list_rate) {
				return {rate: "..."};
			}

			if (!this.price?.price_list_rate && !this.price?.pricing_rule_rate) {
				return {rate: ""};
			}

			let out = {
				rate: format_currency(this.price.price_list_rate, this.currency)
			};

			if (this.price.pricing_rule_rate) {
				out.rate = format_currency(this.price.pricing_rule_rate, this.currency);

				out.rate_before = null;
				if (this.price.price_list_rate && this.price.pricing_rule_rate < this.price.price_list_rate) {
					out.rate_before = format_currency(this.price.price_list_rate, this.currency);
				}

				out.discount = null;
				if (flt(this.price.discount_percentage, 1)) {
					out.discount = format_number(this.price.discount_percentage, null, 1) + "%";
				} else if (this.price.discount_amount) {
					out.discount = format_currency(this.price.discount_amount, this.currency, null, false);
				}

				out.price_conditional = this.price.pricing_rule_conditional;
			}

			if (this.price.pricing_rule_free_item) {
				out.buy_qty = flt(this.price.pricing_rule_buy_qty) || 1;
				out.buy_qty = format_number(out.buy_qty, null, 1);

				out.free_qty = flt(this.price.pricing_rule_free_qty) || 1;
				out.free_qty = format_number(out.free_qty, null, 1);

				if (this.price.pricing_rule_free_item != this.item.name) {
					let free_item = get_item(this.price.pricing_rule_free_item);
					out.free_item_name = free_item?.item_name || this.price.pricing_rule_free_item;
				}

				out.free_item_conditional = this.price.pricing_rule_conditional;
			}

			return out;
		},

		currency() {
			return this.item_price_resource.data?.price_list_currency;
		},

		price() {
			if (!this.item_price_resource?.data?.item_prices_map[this.item.name]) {
				return null;
			}
			return this.item_price_resource.data.item_prices_map[this.item.name];
		},

		item_price_resource() {
			return get_item_prices_resource(cart.doc?.customer);
		},
	}
}
</script>
