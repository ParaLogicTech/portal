<template>
	<input
		v-model="formatted_value"
		class="field text-right remove-arrow"
		@change="handle_change"
		@keydown="handle_keydown"
		@focus="handle_focus"
		@blur="set_is_focused"
		inputmode="numeric"
		pattern="[0-9]+([\.,][0-9]+)?"
		min="0"
	/>
</template>

<script>
import NumberField from "@/mixins/NumberField";

export default {
	name: "CurrencyField",

	mixins: [NumberField],

	props: {
		currency: {
			type: String,
			required: true,
		},
	},

	methods: {
		get_formatted_value() {
			return format_currency(this.display_value, this.currency);
		}
	},
}
</script>
