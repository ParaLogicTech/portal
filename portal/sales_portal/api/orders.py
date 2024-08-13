import frappe
from frappe import _
from frappe.utils import validate_email_address, cstr, strip_html
from portal.sales_portal.api.customers import postprocess_address, postprocess_contact
from portal.permissions import is_system_user
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


@frappe.whitelist()
def send_sales_order_email(name, recipient=None, subject=None, message=None):
	from frappe.core.doctype.communication.email import _make
	from frappe.email.doctype.email_template.email_template import get_email_template

	recipient = cstr(recipient).strip()

	doc = frappe.get_doc("Sales Order", name)
	doc.check_permission("read")

	# Validate recipients / Do not let customer set email manually
	if not is_system_user():
		allowed_recipients = [doc.contact_email, frappe.session.user]
		allowed_recipients = [e for e in allowed_recipients if e]

		if not recipient or recipient not in allowed_recipients:
			recipient = doc.contact_email or frappe.session.user

	recipient = cstr(recipient).strip()
	if not recipient:
		frappe.throw(_("Recipient is not provided"))

	recipient = validate_email_address(recipient, throw=True)

	# Set missing message and subject
	stripped_message = strip_html(message)
	if not subject and not stripped_message:
		email_template = frappe.db.get_single_value("Sales Portal Settings", "sales_order_email_template")
		if email_template:
			template = get_email_template(email_template, doc.as_dict())
			if not subject:
				subject = template.get("subject")
			if not stripped_message:
				message = template.get("message")

	if not subject or not strip_html(message):
		frappe.throw(_("Subject and Message cannot be empty"))

	_make(
		doctype="Sales Order",
		name=name,
		recipients=[recipient],
		subject=subject,
		content=message,
		send_email=True,
		print_format=doc.meta.default_print_format or "Standard",
		print_letterhead=True,
	)

	return recipient
