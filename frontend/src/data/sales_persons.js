import {createListResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {computed} from "vue";

export const sales_person_list = createListResource({
	doctype: 'Sales Person',
	cache: 'Sales Persons',
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
	sales_person_list.reload().catch(e => {
		createAlert({"title": "Error loading Sales Persons", "message": e, "variant": "error"});
	});
}
