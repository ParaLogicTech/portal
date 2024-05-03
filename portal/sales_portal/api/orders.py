import frappe
from portal.sales_portal.api.customers import postprocess_address, postprocess_contact


@frappe.whitelist()
def get_sales_order(name):
	doc = frappe.get_doc("Sales Order", name)
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
