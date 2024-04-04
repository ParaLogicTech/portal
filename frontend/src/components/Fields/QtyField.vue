<template>
	<div class="text-md">
		<input
			v-model="display_value.qty"
			class="h-full w-[50px] px-0.5 py-0 remove-arrow text-sm font-medium text-center rounded-sm border-gray-400"
			ref="qty_input"
			@change="this.handle_qty_change"
			@keydown="this.handle_qty_keydown"
			@input="this.handle_qty_input"
			@focus="this.handle_qty_focus"
			@blur="this.set_is_focused"
			type="number"
			inputmode="numeric"
			pattern="[0-9]+([\.,][0-9]+)?"
			min="0"
		/>
		<select
			v-model="display_value.uom"
			class="h-full w-[60px] px-1 py-0 remove-arrow text-xs font-medium ml-0.5 rounded-sm border-gray-400 text-gray-800"
			ref="uom_input"
			@focus="this.set_is_focused"
			@blur="this.set_is_focused"
			disabled="disabled"
		>
			<option>{{ display_value.uom }}</option>
		</select>
	</div>
</template>

<script>
export default {
	name: "QtyField",

	props: {
		modelValue: {
			qty: Number,
			uom: String,
		},
	},

	data() {
		return {
			display_value: {
				qty: this.modelValue.qty,
				uom: this.modelValue.uom,
			},
			change_timeout: null,
			focused: false,
		}
	},

	emits: ['update:modelValue', 'arrow-up', 'arrow-down', 'focus', 'blur'],

	methods: {
		focus() {
			this.$refs.qty_input?.focus();
		},

		handle_qty_change() {
			this.debounced_qty_change(150);
		},

		handle_qty_input() {
			if (this.display_value.qty == 0) {
				this.clear_timeout();
				return;
			}
			this.debounced_qty_change(1000);
		},

		handle_qty_keydown(e) {
			if (e.code == "ArrowUp") {
				e.preventDefault();
				this.$emit("arrow-up", e);
			} else if (e.code == "ArrowDown") {
				e.preventDefault();
				this.$emit("arrow-down", e);
			}
		},

		debounced_qty_change(wait) {
			wait = wait || 150;
			this.clear_timeout();
			this.change_timeout = setTimeout(this.trigger_qty_change, wait || 250);
		},

		trigger_qty_change() {
			this.clear_timeout();

			if (this.display_value.qty == null || this.display_value.qty === "") {
				return;
			}
			if (this.display_value.qty == this.modelValue.qty && this.display_value.uom == this.modelValue.uom) {
				return;
			}

			this.$emit('update:modelValue', {
				qty: this.display_value.qty,
				uom: this.display_value.uom,
			});
		},

		clear_timeout() {
			if (this.change_timeout) {
				clearTimeout(this.change_timeout);
				this.change_timeout = null;
			}
		},

		handle_qty_focus() {
			this.select_qty_input();
			this.set_is_focused();
		},

		set_is_focused() {
			let previous_focused = this.focused;
			this.focused = [this.$refs.qty_input, this.$refs.uom_input].includes(document.activeElement);

			if (previous_focused != this.focused) {
				if (this.focused) {
					this.$emit('focus');
				} else {
					this.$emit('blur');
				}
			}
		},

		select_qty_input() {
			this.$refs.qty_input?.select();
		},

		refresh() {
			this.display_value.qty = this.modelValue.qty;
			this.display_value.uom = this.modelValue.uom;
		},
	},
}
</script>

<style>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
	appearance: none;
	margin: 0;
}

.remove-arrow {
	appearance: none;
	background-position: right 0.1rem center;
}
</style>
