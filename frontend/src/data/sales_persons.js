import {createListResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {computed} from "vue";
import {on_doctype_list_update} from "@/socket";
import debounce from "frappe-ui/src/utils/debounce";

export const sales_person_list = createListResource({
	doctype: 'Sales Person',
	cache: 'Sales Persons',
	url: 'portal.sales_portal.api.sales_persons.get_sales_person_list',
	fields: [
		'name',
		'enabled',
		'parent_sales_person',
		'lft',
		'rgt',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export const active_sales_persons = computed(() => {
	return (sales_person_list.data || []).filter((d) => {
		return (
			d.enabled
		)
	});
});

// Reload Sales Persons
export const reload_sales_person_data = () => {
	reload_sales_persons();
}

const reload_sales_persons = () => {
	sales_person_list.reload().catch(e => {
		createAlert({"title": "Error loading Sales Persons", "message": e, "variant": "error"});
	});
}

const debounced_reload_sales_persons = debounce(reload_sales_persons, 500);

export const setup_sales_person_data_realtime = () => {
	on_doctype_list_update($socket, "Sales Person", (name) => {
		if (!sales_person_list.list.loading) {
			debounced_reload_sales_persons();
		}
	});
};
