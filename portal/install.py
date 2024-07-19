import frappe


def after_install():
	setup_customer_role_profile()


def setup_customer_role_profile():
	changed = False

	if frappe.db.exists("Role Profile", "Customer"):
		doc = frappe.get_doc("Role Profile", "Customer")
	else:
		doc = frappe.new_doc("Role Profile")
		doc.role_profile = "Customer"
		changed = True

	if "Customer" not in [d.role for d in doc.get("roles")]:
		doc.append("roles", {"role": "Customer"})
		changed = True

	if changed:
		doc.save()
