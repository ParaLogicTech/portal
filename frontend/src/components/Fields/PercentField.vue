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
		max="100"
	/>
</template>

<script>
import number_field from "@/mixins/number_field";

export default {
	name: "PercentField",

	mixins: [number_field],

	props: {
		precision: {
			type: Number,
			default: 1,
		},
	},

	methods: {
		get_formatted_value() {
			return format_number(this.display_value, null, this.precision) + "%";
		}
	},
}
</script>
