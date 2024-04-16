import {createResource} from "frappe-ui";
import {createAlert} from "@/utils/alerts";

export let settings = createResource({
	url: 'portal.sales_portal.api.settings.get_settings',
	cache: 'Sales Portal Settings',
});

export let reload_settings_data = () => {
	settings.reload().catch(e => {
		createAlert({"title": "Error loading Sales Portal Settings", "message": e, "variant": "error"});
	});
}
