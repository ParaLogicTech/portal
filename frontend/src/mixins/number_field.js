const number_field = {
	props: {
		modelValue: {
			type: Number,
			default: 0,
		},
		precision: {
			type: Number,
			default: 2,
		},
	},

	data() {
		return {
			change_timeout: null,
			display_value: flt(this.modelValue, this.precision),
			focused: false,
		}
	},

	methods: {
		handle_keydown(e) {
			if (e.code == "ArrowUp") {
				e.preventDefault();
				this.$emit("arrow-up", e);
			} else if (e.code == "ArrowDown") {
				e.preventDefault();
				this.$emit("arrow-down", e);
			}
		},

		handle_change() {
			this.debounced_change(150);
		},

		debounced_change(wait) {
			wait = wait || 150;
			this.clear_timeout();
			this.change_timeout = setTimeout(this.trigger_change, wait);
		},

		trigger_change() {
			this.clear_timeout();

			if (!this.is_changed()) {
				return;
			}

			this.display_value = flt(this.display_value, this.precision);
			this.$emit('update:modelValue', this.display_value);
		},

		clear_timeout() {
			if (this.change_timeout) {
				clearTimeout(this.change_timeout);
				this.change_timeout = null;
			}
		},

		handle_focus() {
			this.set_is_focused();
			this.$nextTick(() => this.select_input());
		},

		set_is_focused() {
			let previous_focused = this.focused;
			this.focused = document.activeElement == this.$el;

			if (previous_focused != this.focused && !this.focused && this.is_changed()) {
				this.debounced_change(150);
			}
		},

		focus() {
			this.select_input();
		},

		select_input() {
			this.$el.select();
		},

		is_changed() {
			if (this.display_value == null || this.display_value === "") {
				return false;
			}
			if (flt(this.display_value, this.precision) == flt(this.modelValue, this.precision)) {
				return false;
			}
			return true;
		},

		refresh() {
			this.display_value = flt(this.modelValue, this.precision);
		},
	},

	computed: {
		formatted_value: {
			get() {
				if (!this.focused && this.get_formatted_value) {
					return this.get_formatted_value();
				} else {
					return this.display_value;
				}
			},
			set(value) {
				this.display_value = value;
			},
		},
	}
}

export default number_field;
