import {createListResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {computed} from "vue";
import debounce from "frappe-ui/src/utils/debounce";
import {on_doctype_list_update} from "@/socket";

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
	transform(data) {
		for (let d of data) {
			let address = [d.address_line1, d.address_line2, d.city, d.state]
				.map(s => cstr(s).trim())
				.filter(Boolean);
			d.address_display_short = address.join(', ');
		}
	},
});

export const active_customers = computed(() => {
	return (customer_list.data || []).filter((d) => {
		return !d.disabled
	});
});

export const active_customers_map = computed(() => {
	let customer_map = {};
	active_customers.value.forEach(c => customer_map[c.name] = c);
	return customer_map;
});

// Reload Customers
export const reload_customer_data = () => {
	reload_customers();
}

const reload_customers = () => {
	customer_list.reload().catch(e => {
		createAlert({"title": "Error Loading Customers", "message": e, "variant": "error"});
	});
}

const debounced_reload_customers = debounce(reload_customers, 500);

export const setup_customer_data_realtime = () => {
	on_doctype_list_update($socket, "Customer", (name) => {
		if (!customer_list.list.loading) {
			debounced_reload_customers();
		}
	});
};
