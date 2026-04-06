import { createListResource } from "frappe-ui";
import {handleRequestError} from "@/utils/alerts";

export let currency_list = createListResource({
	doctype: 'Currency',
	cache: 'Currencies',
	fields: [
		'name',
		'symbol',
		'symbol_on_right',
	],
	orderBy: 'name',
	pageLength: 99999,
});

// Reload Customers
export let reload_currency_data = () => {
	currency_list.reload().catch(e => {
		handleRequestError(e, "Error Loading Currency Data");
	});
}
