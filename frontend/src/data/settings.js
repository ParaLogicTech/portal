import {createResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";
import {computed} from "vue";

export const settings_resource = createResource({
	url: 'portal.sales_portal.api.settings.get_settings',
	cache: 'Sales Portal Settings',
});

export const settings = computed(() => {
	return settings_resource.data || {};
});

export const reload_settings_data = () => {
	settings_resource.reload().catch(e => {
		createAlert({"title": "Error loading Sales Portal Settings", "message": e, "variant": "error"});
	});
}
