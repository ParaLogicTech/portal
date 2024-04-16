import frappe
from erpnext import get_default_company


@frappe.whitelist()
def get_settings():
	settings_doc = frappe.get_cached_doc("Sales Portal Settings", None)

	out = frappe._dict({
		"company": settings_doc.company or get_default_company(),
		"hide_items_without_image": settings_doc.hide_items_without_image,
	})

	return out
