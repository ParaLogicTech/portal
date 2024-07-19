import frappe
from frappe.client import get_list


@frappe.whitelist()
def get_sales_person_list(doctype="Sales Person", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None):
	doctype = "Sales Person"
	parent = None

	filters = frappe.parse_json(filters)

	return get_list(
		doctype=doctype,
		fields=fields,
		filters=filters,
		order_by=order_by,
		limit_start=start,
		limit_page_length=limit,
		group_by=group_by,
		parent=parent,
	)
