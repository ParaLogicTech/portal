import frappe
from frappe import _
from frappe.sessions import get_csrf_token

no_cache = 1


def get_context():
	if frappe.session.user == "Guest":
		frappe.throw(_("Please login first."), frappe.PermissionError)

	csrf_token = get_csrf_token()
	frappe.db.commit()

	context = frappe._dict()
	context.csrf_token = csrf_token
	return context
