<template>
	<Autocomplete
		:options="this.customer_options"
		v-model="customer_model"
		placeholder="Select Customer"
		variant="outline"
		@update:modelValue="this.update_cart_customer"
		ref="autocomplete"
	>
		<template #prefix>
			<CircleUser class="h-[17px] w-[17px] mr-1.5" stroke-width="1.5px" />
		</template>
	</Autocomplete>
</template>

<script>
import {Autocomplete} from "frappe-ui";
import {customer_list, active_customers} from "@/data/customers";
import {cart, _selected_customer} from "@/data/cart";
import {watch} from "vue"
import {CircleUser} from "lucide-vue-next"
import {settings} from "@/data/settings";

export default {
	name: "CustomerSelection",

	components: {
		Autocomplete, CircleUser,
	},

	data() {
		let customer_model = this.get_option_from_name(_selected_customer.value);
		return {
			customer_model: customer_model,
		}
	},

	methods: {
		update_cart_customer(value) {
			// do not let customer user deselect if only one customer
			// Todo make it read only instead
			if (!value && !settings.value.is_system_user && active_customers.value.length == 1) {
				this.customer_model = this.get_option_from_name(_selected_customer.value);
				return;
			}

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
			let opt = {
				label: d.customer_name,
				value: d.name,
			}

			if (settings.value.show_customer_description == "Address Line 1") {
				opt.description = d.address_line1;
			}

			return opt;
		},

		toggle_customer_selection(val) {
			this.$refs.autocomplete?.togglePopover(val);
		},
	},

	computed: {
		customer_options() {
			let customers = active_customers.value || [];
			return customers.map(d => this.get_option(d));
		}
	},

	created() {
		watch(_selected_customer, (new_customer, old_customer) => {
			this.customer_model = this.get_option_from_name(new_customer);
		});
	}
}
</script>
