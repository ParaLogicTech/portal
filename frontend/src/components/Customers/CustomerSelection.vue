<template>
	<Autocomplete
		:options="this.customer_options"
		v-model="customer"
		placeholder="Select Customer..."
		variant="outline",
		@update:modelValue="this.update_cart_customer"
	/>
</template>

<script>
import {customer_list} from "@/data/customers";
import {cart, _selected_customer} from "@/data/cart";
import {watch} from "vue"

export default {
	name: "CustomerSelection",

	data() {
		let customer = this.get_option_from_name(_selected_customer.value);
		return {
			customer: customer,
		}
	},

	methods: {
		update_cart_customer(value) {
			cart.set_customer(value?.value);
		},

		get_option_from_name(customer) {
			let customer_obj = customer_list.dataMap[customer];
			if (customer_obj) {
				return this.get_option(customer_obj);
			} else {
				return null;
			}
		},

		get_option(d) {
			return {
				label: d.customer_name,
				value: d.name,
			}
		},
	},

	computed: {
		customer_options() {
			let customers = customer_list.data || [];
			return customers.map(d => this.get_option(d));
		}
	},

	created() {
		watch(_selected_customer, (new_customer, old_customer) => {
			this.customer = this.get_option_from_name(new_customer);
		});
	}
}
</script>
