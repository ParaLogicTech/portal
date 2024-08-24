const SelectableItems = {
	computed: {
		selectable_items_elements() {
			return this.selectable_items_list;
		},

		selectable_items_list() {
			return this.items;
		},
	},

	methods: {
		get_next_row(current_row) {
			let current_row_idx = this.selectable_items_elements.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx + 1 < this.selectable_items_elements.length) {
				return this.selectable_items_elements[current_row_idx + 1];
			}
		},

		get_previous_row(current_row) {
			let current_row_idx = this.selectable_items_elements.findIndex(d => d == current_row);
			if (current_row_idx != -1 && current_row_idx - 1 >= 0) {
				return this.selectable_items_elements[current_row_idx - 1];
			}
		},

		get_row_by_item_code(item_code) {
			return this.selectable_items_list.find(d => d.item_code === item_code);
		},
	},
}

export default SelectableItems;
