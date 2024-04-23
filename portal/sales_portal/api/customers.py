import frappe
from frappe.utils import cint
from frappe.client import get_list
from erpnext.accounts.party import get_address_display, get_contact_details


@frappe.whitelist()
def get_customer_list(doctype="Customer", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None, debug=False):
	filters = frappe.parse_json(filters)

	out = get_list(doctype, fields, filters, order_by, start, limit, parent)
	return out


@frappe.whitelist()
def get_customer_address_and_contact(customer=None):
	return {
		"addresses": get_customer_addresses(customer),
		"contacts": get_customer_contacts(customer),
	}


def get_customer_addresses(customer):
	if not customer:
		return []

	filters = [
		["Dynamic Link", "link_doctype", "=", "Customer"],
		["Dynamic Link", "link_name", "=", customer],
		["Dynamic Link", "parenttype", "=", "Address"]
	]

	addresses = frappe.get_list("Address", filters=filters, fields=["*"], order_by="creation asc")
	addresses = sorted(addresses, key=lambda d: cint(d.is_primary_address), reverse=True)
	for d in addresses:
		d.address_display = get_address_display(d)

	return addresses


def get_customer_contacts(customer):
	if not customer:
		return []

	filters = [
		["Dynamic Link", "link_doctype", "=", "Customer"],
		["Dynamic Link", "link_name", "=", customer],
		["Dynamic Link", "parenttype", "=", "Contact"]
	]

	contacts = frappe.get_list("Contact", filters=filters, fields=["*"], order_by="creation asc")
	contacts = sorted(contacts, key=lambda d: cint(d.is_primary_contact), reverse=True)
	for d in contacts:
		d.contact_display = " ".join(
			filter(None, [d.get("salutation"), d.get("first_name"), d.get("last_name")])
		)

	return contacts
