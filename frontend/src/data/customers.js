import {createListResource, createResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {reactive} from "vue";

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
	],
	orderBy: 'name',
	pageLength: 99999,
});

const address_and_contact_resources = reactive({});
export const get_customer_address_and_contacts = (customer) => {
	if (!customer) {
		return null;
	}

	if (!address_and_contact_resources[customer]) {
		let resource = address_and_contact_resources[customer] = createResource({
			url: 'portal.sales_portal.api.customers.get_customer_address_and_contact',
			params: {
				customer: customer
			},
		});

		resource.reload().catch(e => {
			createAlert({"title": "Error loading Address and Contacts", "message": e, "variant": "error"});
		});
	}

	return address_and_contact_resources[customer];
};

// Reload Customers
export const reload_customer_data = () => {
	customer_list.reload().catch(e => {
		createAlert({"title": "Error loading Customers", "message": e, "variant": "error"});
	});
}
