import frappe
from frappe import _


def customer_validate(doc, method):
	validate_duplicate_portal_users(doc)
	validate_customer_user_type(doc)
	set_user_contact_details(doc)


def customer_on_update(doc, method):
	link_user_contacts_with_customer(doc)


def validate_duplicate_portal_users(doc):
	visited = set()
	for d in doc.get("portal_users"):
		if not d.user:
			continue

		if d.user in visited:
			frappe.throw(_("Row #{0}: Duplicated Portal User {1}").format(d.idx, d.user))

		visited.add(d.user)


def validate_customer_user_type(doc):
	for d in doc.get("portal_users"):
		if not d.user:
			continue

		if d.user in ("Administrator", "Guest"):
			frappe.throw(_("Portal User cannot be {0}").format(d.user))

		if frappe.db.get_value("User", d.user, "user_type") != "Website User":
			frappe.throw(_("Row #{0}: Portal {1} must be of Website User type").format(
				d.idx, frappe.get_desk_link("User", d.user)
			))


def set_user_contact_details(doc):
	from erpnext.accounts.party import get_contact_details

	for d in doc.get("portal_users"):
		# set contact name
		contact_details = get_contact_details(d.user_contact)
		d.user_contact_display = contact_details.contact_display


def link_user_contacts_with_customer(doc):
	for d in doc.get("portal_users"):
		if d.user_contact:
			contact = frappe.get_doc("Contact", d.user_contact)
			if contact.has_link("Customer", doc.name):
				continue

			row = contact.append("links", {"link_doctype": "Customer", "link_name": doc.name})
			row.db_insert()
