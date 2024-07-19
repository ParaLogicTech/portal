import frappe


def execute():
	names = frappe.db.sql_list("select distinct cart from `tabSales Order` where docstatus != 0")
	for name in names:
		frappe.get_doc("Cart", name).set_status(update=True, update_modified=False)
