import frappe
from frappe.utils import cint
from frappe.client import get_list
from portal.permissions import check_customer_permission
from erpnext.accounts.party import render_address


mandatory_customer_fields = ["name"]


@frappe.whitelist()
def get_customer_list(doctype="Customer", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None):
	doctype = "Customer"
	parent = None

	filters = frappe.parse_json(filters)

	# Mandatory fields
	if not fields:
		fields = []
	for f in mandatory_customer_fields:
		if f not in fields:
			fields.append(f)

	include_restricted_item_groups = False
	if "portal_restricted_item_groups" in fields:
		fields.remove("portal_restricted_item_groups")
		include_restricted_item_groups = True

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

	# Item Group Restriction Data
	if out and include_restricted_item_groups:
		customers_map = {}
		for customer in out:
			customers_map[customer.name] = customer
			customer.portal_restricted_item_groups = []

		customers = list(customers_map.keys())
		restricted_item_group_data = frappe.db.sql("""
			select parent, item_group
			from `tabItem Group Option`
			where parent in %s and parenttype = 'Customer'
			order by idx
		""", [customers], as_dict=1)

		for d in restricted_item_group_data:
			customers_map[d.parent].portal_restricted_item_groups.append(d.item_group)

	return out


@frappe.whitelist()
def get_customer_address_and_contact(customer=None):
	check_customer_permission(customer)

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
		postprocess_address(d)

	return addresses


def postprocess_address(address):
	address.address_display = render_address(address)
	return address


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
		postprocess_contact(d)

	return contacts


def postprocess_contact(contact):
	contact.contact_display = " ".join(
		filter(None, [contact.get("salutation"), contact.get("first_name"), contact.get("last_name")])
	)
	return contact
