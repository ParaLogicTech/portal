import frappe
from frappe import _


def validate_customer_role(doc, method):
	if doc.user_type != "System User":
		return

	if "Customer" in [d.role for d in doc.get("roles")]:
		frappe.msgprint(_("Removing Customer role because the User {0} is a System User").format(doc.name))
		doc.get("roles").remove(doc.get("roles", {"role": "Customer"})[0])


def override_user_dashboard(data):
	data.setdefault("non_standard_fieldnames", {})
	data["non_standard_fieldnames"]["Customer"] = "user"

	data["transactions"].append({
		"label": _("Portal"),
		"items": ["Customer"]
	})

	return data
