import frappe
from frappe.model.utils.rename_field import rename_field
from frappe.utils.fixtures import sync_fixtures


def execute():
	if not frappe.db.has_column("Item", "show_in_customer_portal"):
		return

	sync_fixtures(app="portal")
	frappe.delete_doc_if_exists("Custom Field", "Item-show_in_customer_portal")
	rename_field("Item", "show_in_customer_portal", "show_in_sales_portal")
