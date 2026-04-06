import {createResource} from "frappe-ui";
import {handleRequestError} from "@/utils/alerts";
import {computed} from "vue";

export const settings_resource = createResource({
	url: 'portal.sales_portal.api.settings.get_settings',
	method: 'GET',
	cache: 'Sales Portal Settings',
});

export const settings = computed(() => {
	return settings_resource.data || {};
});

export const reload_settings_data = () => {
	settings_resource.reload().catch(e => {
		handleRequestError(e, "Error Loading Sales Portal Settings");
	});
}
