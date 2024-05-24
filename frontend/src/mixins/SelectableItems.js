const SelectableItems = {
	methods: {
		get_next_row(current_row) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.items.length) {
				return this.items[current_row_idx + 1];
			}
		},

		get_previous_row(current_row) {
			let current_row_idx = this.items.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx - 1 >= 0) {
				return this.items[current_row_idx - 1];
			}
		},

		get_row_by_item_code(item_code) {
			return this.items.find(d => d.item_code === item_code);
		},
	},
}

export default SelectableItems;
