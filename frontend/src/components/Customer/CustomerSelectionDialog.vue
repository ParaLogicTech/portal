<template>
	<Dialog
		v-model="model"
		:options="{
			title: this.title,
			size: '5xl'
		}"
		@keydown="handle_keydown"
	>
		<template #body-title>
			<div class="text-xl font-medium">
				{{ title }}
			</div>
		</template>

		<template #body-content>
			<TextInput
				v-model="filters.txt"
				class="w-full"
				type="text"
				size="sm"
				variant="outline"
				placeholder="Search Customer"
				:debounce="150"
				ref="search_field"
			>
				<template #prefix>
					<FeatherIcon class="w-4" name="search"/>
				</template>
			</TextInput>

			<CustomerList
				class="h-[70vh] mt-2"
				:rows="filtered_customers"
				:loading="loading"
				@customer-selected="customer_selected"
				ref="customer_list"
			/>
		</template>
	</Dialog>
</template>

<script>
import CustomerList from "@/components/Customer/CustomerList.vue";
import {active_customers, customer_list} from "@/data/customers";
import SearchFilter from "@/components/Utils/SearchFilter.vue";
import FuzzySearch from "@/mixins/FuzzySearch";
import {cart} from "@/data/cart";
import {Button, TextInput} from "frappe-ui";
import {CircleX} from "lucide-vue-next";

export default {
	name: "CustomerSelectionDialog",

	components: {TextInput, CircleX, SearchFilter, CustomerList, Button},

	mixins: [FuzzySearch],

	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
		keep_cart: Boolean,
	},

	data() {
		return {
			filters: {
				txt: null,
			},
			fuzzy_search_keys: ['customer_name', 'name', 'address_display_short'],
		};
	},

	methods: {
		async customer_selected(customer) {
			if (this.keep_cart) {
				await cart.change_cart_customer(customer, true);
			} else {
				await cart.set_customer(customer, true);
			}

			this.model = false;
		},

		focus_search() {
			this.$refs.search_field?.$refs.inputRef?.focus();
		},

		handle_keydown(e) {
			if (e.code == "ArrowUp") {
				e.preventDefault();
				e.stopPropagation();
				this.$refs.customer_list?.highlight_previous_customer();
			} else if (e.code == "ArrowDown") {
				e.preventDefault();
				e.stopPropagation();
				this.$refs.customer_list?.highlight_next_customer();
			} else if (e.code == "Enter") {
				e.preventDefault();
				e.stopPropagation();
				this.$refs.customer_list?.select_highlighted_customer();
			}
		},
	},

	computed: {
		model: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit('update:modelValue', value);
			},
		},

		title() {
			return this.keep_cart ? 'Change Customer in Cart' : 'Select Customer'
		},

		loading() {
			return customer_list.list.loading;
		},

		filtered_customers() {
			return this.fuzzy_filtered_items;
		},

		list_data() {
			return this.sorted_customers;
		},

		sorted_customers() {
			let sorted = (active_customers.value || []).toSorted((a, b) => {
				let a_idx = 1;
				let b_idx = 1;

				if (cart.customer) {
					if (a.name == cart.customer) {
						a_idx = 0;
					}
					if (b.name == cart.customer) {
						b_idx = 0;
					}
				}

				return a_idx - b_idx;
			});

			if (sorted.length && cart.selected_customer && !this.keep_cart) {
				return [{}, ...sorted];
			} else {
				return sorted;
			}
		}
	},

	watch: {
		model(new_value, old_value) {
			if (new_value) {
				this.filters.txt = null;
				this.$nextTick(() => {
					this.focus_search();
				});
			}
		}
	}
}
</script>
