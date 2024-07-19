import frappe
from frappe.utils.fixtures import sync_fixtures
from portal.install import setup_customer_role_profile


def execute():
	user_customer_roles = frappe.db.sql("""
		select r.name
		from `tabHas Role` r
		inner join `tabUser` u on r.parent = u.name and r.parenttype = 'User'
		where u.user_type = 'System User' and r.role = 'Customer'
	""")

	role_profile_roles = frappe.db.sql("""
		select r.name
		from `tabHas Role` r
		inner join `tabRole Profile` p on r.parent = p.name and r.parenttype = 'Role Profile'
		where r.role = 'Customer' and r.name != 'Customer'
	""")

	to_delete = user_customer_roles + role_profile_roles
	if to_delete:
		frappe.db.sql("""
			delete from `tabHas Role`
			where name in %s
		""", [to_delete])

	sync_fixtures("portal")

	frappe.db.sql("update tabItem set show_in_customer_portal = 1")
