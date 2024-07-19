import frappe
from portal.sales_portal.api.customers import postprocess_address, postprocess_contact
from frappe.client import get_list


@frappe.whitelist()
def get_sales_order_list(doctype="Sales Order", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None, debug=False):
	doctype = "Sales Order"
	parent = None

	filters = frappe.parse_json(filters)

	out = get_list(
		doctype=doctype,
		fields=fields,
		filters=filters,
		order_by=order_by,
		limit_start=start,
		limit_page_length=limit,
		group_by=group_by,
		parent=parent,
	)

	sales_order_map = {}
	for d in out:
		sales_order_map[d.name] = d
		d.sales_team = []

	names = list(sales_order_map.keys())
	name_condition = ""
	if filters:
		name_condition = "and parent in %(names)s"

	sales_team_data = []
	if names:
		sales_team_data = frappe.db.sql(f"""
			select parent, sales_person
			from `tabSales Team`
			where parenttype = 'Sales Order' {name_condition}
		""", {"names": names}, as_dict=1)

	for d in sales_team_data:
		if d.parent in sales_order_map:
			sales_order_map[d.parent].sales_team.append(d)

	for d in out:
		d.sales_person = ", ".join(list(set([d.sales_person for d in d.sales_team])))

	return out


@frappe.whitelist()
def get_sales_order(name):
	doc = frappe.get_doc("Sales Order", name)
	doc.check_permission("read")
	return get_output(doc)


def get_output(doc):
	out = frappe._dict({
		"doc": doc,
		"address": None,
		"contact": None,
	})

	if doc.customer_address:
		out.address = frappe.get_doc("Address", doc.customer_address).as_dict()
		postprocess_address(out.address)

	if doc.contact_person:
		out.contact = frappe.get_doc("Contact", doc.contact_person).as_dict()
		postprocess_contact(out.contact)

	return out
