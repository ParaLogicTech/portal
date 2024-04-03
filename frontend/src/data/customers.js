import { createListResource } from "frappe-ui";

export let customer_list = createListResource({
	doctype: 'Customer',
	cache: 'Customers',
	fields: [
		'name',
		'customer_name',
		'image',
		'customer_group',
		'territory',
		'disabled',
	],
	orderBy: 'name',
	pageLength: 99999,
});

// Reload Customers
export let reload_customer_data = () => {
	customer_list.fetch();
}
