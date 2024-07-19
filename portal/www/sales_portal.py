import frappe
from frappe import _
from frappe.sessions import get_csrf_token

no_cache = 1


def get_context():
	if frappe.session.user == "Guest":
		frappe.throw(_("Please login to access the Sales Portal"), frappe.PermissionError)

	if frappe.session.data.user_type != "System User" and "Customer" not in frappe.get_roles():
		frappe.throw(_("You do not have permission to access the Sales Portal"), frappe.PermissionError)

	csrf_token = get_csrf_token()
	frappe.db.commit()

	context = frappe._dict()
	context.csrf_token = csrf_token
	return context
