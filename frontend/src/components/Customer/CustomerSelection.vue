<template>
	<Button
		class="w-full justify-between"
		:disabled="!can_change"
		@click="handle_click"
	>
		<template #default>
			<div class="flex items-center flex-nowrap text-sm" :class="text_classes">
				<CircleUser class="h-[17px] w-[17px] mr-1.5 inline" stroke-width="1.5px" />
				<div>{{ customer_text }}</div>
			</div>
		</template>

		<template #suffix v-if="can_change">
			<ChevronsUpDown class="h-[16px] w-[16px] text-gray-700 text-right" stroke-width="1.7px" />
		</template>
	</Button>
</template>

<script>
import {Button} from "frappe-ui";
import {customer_list, active_customers} from "@/data/customers";
import {cart, toggle_customer_selection} from "@/data/cart";
import {watch} from "vue"
import {CircleUser, ChevronsUpDown} from "lucide-vue-next"
import {settings} from "@/data/settings";

export default {
	name: "CustomerSelection",

	components: {
		CircleUser,
		Button,
		ChevronsUpDown,
	},

	data() {
		return {
			value: cart.selected_customer,
		}
	},

	methods: {
		handle_click() {
			toggle_customer_selection(true);
		}
	},

	computed: {
		customer_text() {
			if (!this.value) {
				return "Select Customer";
			} else {
				return this.customer?.customer_name || this.value;
			}
		},

		text_classes() {
			return this.value ? "text-black" : "text-gray-600";
		},

		customer() {
			return this.value ? customer_list.dataMap[this.value] : null;
		},

		can_change() {
			return !this.value || settings.value.is_system_user || active_customers.value.length > 1;
		},
	},

	created() {
		watch(() => cart.selected_customer, (new_customer, old_customer) => {
			this.value = new_customer;
		});
	}
}
</script>
