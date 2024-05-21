import {createListResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {computed} from "vue";

export const customer_list = createListResource({
	doctype: 'Customer',
	cache: 'Customers',
	url: 'portal.sales_portal.api.customers.get_customer_list',
	fields: [
		'name',
		'customer_name',
		'image',
		'customer_group',
		'territory',
		'disabled',
		'address_line1',
		'address_line2',
		'city',
		'state',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export const active_customers = computed(() => {
	return (customer_list.data || []).filter((d) => {
		return !d.disabled
	});
});

// Reload Customers
export const reload_customer_data = () => {
	customer_list.reload().catch(e => {
		createAlert({"title": "Error loading Customers", "message": e, "variant": "error"});
	});
}
