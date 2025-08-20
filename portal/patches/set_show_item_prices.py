import frappe
from frappe.utils.fixtures import sync_fixtures


def execute():
	sync_fixtures("portal")
	if not frappe.db.get_single_value("Sales Portal Settings", "show_item_prices"):
		frappe.db.set_single_value("Sales Portal Settings", "show_item_prices", "Show Prices to Everyone")
