<template>
	<div class="qty-field-container field">
		<input
			v-model="display_value.qty"
			class="remove-arrow"
			ref="qty_input"
			@change.stop="this.handle_qty_change"
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
			class="remove-arrow"
			ref="uom_input"
			@change.stop="this.handle_qty_change"
			@focus="this.set_is_focused"
			@blur="this.set_is_focused"
		>
			<option
				v-for="uom in uom_options"
				:key="uom"
				:selected="uom == display_value.uom"
			>
				{{ uom }}
			</option>
		</select>
	</div>
</template>

<script>
export default {
	name: "QtyField",

	props: {
		qty: {
			type: Number,
			default: 0,
		},
		uom: String,
		uoms: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			display_value: {
				qty: this.qty,
				uom: this.uom,
			},
			change_timeout: null,
			focused: false,
		}
	},

	emits: ['change', 'update:qty', 'update:uom', 'arrow-up', 'arrow-down', 'focus', 'blur'],

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

			if (!this.is_changed()) {
				return;
			}

			this.$emit('update:qty', this.display_value.qty);
			this.$emit('update:uom', this.display_value.uom);
			this.$emit('change', this.display_value.qty, this.display_value.uom)
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
					if (this.is_changed()) {
						this.debounced_qty_change(150);
					}
				}
			}
		},

		select_qty_input() {
			this.$refs.qty_input?.select();
		},

		is_changed() {
			if (this.display_value.qty == null || this.display_value.qty === "") {
				return false;
			}
			if (this.display_value.qty == this.qty && this.display_value.uom == this.uom) {
				return false;
			}
			return true;
		},

		refresh() {
			if (this.focused) {
				return;
			}
			this.display_value.qty = this.qty;
			this.display_value.uom = this.uom;
		},
	},

	computed: {
		uom_options() {
			let uoms = this.uoms || [];
			if (this.display_value.uom && !uoms.find(uom => uom == this.display_value.uom)) {
				uoms = [this.display_value.uom, ...uoms];
			}
			return uoms;
		}
	}
}
</script>

<style lang="scss">
.qty-field-container {
	@apply text-md flex;

	input {
		width: 50px;
		@apply h-full text-sm font-medium text-center border-0 border-r border-gray-400 flex-shrink-0 px-0.5 py-0;
	}
	select {
		width: 100%;
		@apply h-full text-[11.5px] font-medium text-gray-800 border-0 pl-[5px] pr-[16px] py-0;
		background-position: right 0.2rem center;
	}

	&.compact-qty-field select {
		@apply pr-[13px];
		background-position: right 0.1rem center;
	}
}
</style>
