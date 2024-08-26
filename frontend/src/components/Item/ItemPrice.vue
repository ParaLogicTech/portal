<template>
	<div class="flex flex-wrap gap-x-1 items-center justify-end">
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

			<div class="!font-semibold text-violet-900">
				{{ output.rate }}
			</div>
		</div>
	</div>
</template>

<script>
import { get_item_prices_resource } from "@/data/items";
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
			} else if (this.price?.price_list_rate) {
				if (this.price.pricing_rule_rate) {
					let discount = null;
					if (flt(this.price.discount_percentage, 1)) {
						discount = format_number(this.price.discount_percentage, null, 1) + "%";
					} else if (this.price.discount_amount) {
						discount = format_currency(this.price.discount_amount, this.currency, null, false);
					}

					let rate_before = null;
					if (this.price.price_list_rate && this.price.pricing_rule_rate < this.price.price_list_rate) {
						rate_before = format_currency(this.price.price_list_rate, this.currency);
					}

					return {
						discount: discount,
						rate_before: rate_before,
						rate: format_currency(this.price.pricing_rule_rate, this.currency)
					}
				} else {
					return {rate: format_currency(this.price.price_list_rate, this.currency)};
				}
			} else {
				return {rate: "N/A"};
			}
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
