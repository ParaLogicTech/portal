import frappe
from frappe import _
from frappe.utils import cint
from erpnext.setup.doctype.item_group.item_group import get_item_groups_with_ancestors, get_exploded_item_groups


def has_permission_customer(doc, user=None, permission_type=None):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers(user)
	if doc.name not in allowed_customers:
		return False


def permission_query_conditions_customer(user=None):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers(user)

	if allowed_customers:
		formatted_customers = ", ".join([frappe.db.escape(c) for c in allowed_customers])
		return f"(`tabCustomer`.name IN ({formatted_customers}))"
	else:
		return "(1 != 1)"


def has_permission_item(doc, user=None, permission_type=None):
	if is_system_user(user):
		return

	restricted_item_groups = get_restricted_item_groups(user)
	if restricted_item_groups and doc.item_group not in restricted_item_groups:
		return False

	if not doc.show_in_customer_portal:
		return False


def permission_query_conditions_item(user=None):
	if is_system_user(user):
		return

	conditions = [
		"`tabItem`.show_in_customer_portal = 1"
	]

	restricted_item_groups = get_restricted_item_groups(user)
	if restricted_item_groups:
		formatted_item_groups = ", ".join([frappe.db.escape(c) for c in restricted_item_groups])
		conditions.append(f"`tabItem`.item_group in ({formatted_item_groups})")

	return f"({' and '.join(conditions)})"


def has_permission_item_group(doc, user=None, permission_type=None):
	if is_system_user(user):
		return

	allowed_item_groups = get_item_groups_for_customer_portal(user=user)
	if doc.name not in allowed_item_groups:
		return False


def permission_query_conditions_item_group(user=None):
	if is_system_user(user):
		return

	allowed_item_groups = get_item_groups_for_customer_portal(user=user)
	if allowed_item_groups:
		formatted_item_groups = ", ".join([frappe.db.escape(c) for c in allowed_item_groups])
		return f"(`tabItem Group`.name IN ({formatted_item_groups}))"
	else:
		return "(1 != 1)"


def get_item_groups_for_customer_portal(user=None):
	if not user:
		user = frappe.session.user

	def generator():
		allowed_item_groups = frappe.db.sql_list("""
			select distinct item_group
			from `tabItem`
			where show_in_customer_portal = 1
		""")

		restricted_item_groups = get_restricted_item_groups(user)
		if restricted_item_groups:
			allowed_item_groups = [ig for ig in allowed_item_groups if ig in restricted_item_groups]

		return get_item_groups_with_ancestors(allowed_item_groups)

	return frappe.local_cache("get_item_groups_for_customer_portal", user, generator)


def get_restricted_item_groups(user=None):
	if not user:
		user = frappe.session.user

	def generator():
		restricted_item_groups = []

		allowed_customers = get_user_customers(user)
		for customer in allowed_customers:
			customer_doc = frappe.get_cached_doc("Customer", customer)
			if not customer_doc.get("portal_restricted_item_groups"):
				return []

			for d in customer_doc.get("portal_restricted_item_groups"):
				restricted_item_groups.append(d.item_group)

		restricted_item_groups = get_exploded_item_groups(restricted_item_groups)
		return restricted_item_groups

	return frappe.local_cache("get_restricted_item_groups", user, generator)


def has_permission_brand(doc, user=None, permission_type=None):
	if is_system_user(user):
		return

	has_permitted_item = frappe.db.get_value("Item", {
		"brand": doc.name, "show_in_customer_portal": 1,
	})
	if not has_permitted_item:
		return False


def permission_query_conditions_brand(user=None):
	if is_system_user(user):
		return

	return """(exists(select `tabItem`.name from `tabItem`
		where `tabItem`.brand = `tabBrand`.name and `tabItem`.show_in_customer_portal = 1))"""


def has_permission_sales_person(doc, user=None, permission_type=None):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers()
	allowed_sales_persons = get_sales_persons_by_customers(allowed_customers)

	if doc.name not in allowed_sales_persons:
		return False


def permission_query_conditions_sales_person(user=None):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers()
	allowed_sales_persons = get_sales_persons_by_customers(allowed_customers)

	if allowed_sales_persons:
		formatted_sales_persons = ", ".join([frappe.db.escape(c) for c in allowed_sales_persons])
		return f"(`tabSales Person`.name IN ({formatted_sales_persons}))"
	else:
		return "(1 != 1)"


def has_permission_sales_order(doc, user=None, permission_type=None):
	return has_permission_order(doc, user)


def permission_query_conditions_sales_order(user=None):
	return permission_query_conditions_order("Sales Order", user)


def has_permission_cart(doc, user=None, permission_type=None):
	return has_permission_order(doc, user)


def permission_query_conditions_cart(user=None):
	return permission_query_conditions_order("Cart", user)


def has_permission_order(doc, user):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers()
	if doc.customer not in allowed_customers:
		return False


def permission_query_conditions_order(doctype, user):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers()

	if allowed_customers:
		formatted_customers = ", ".join([frappe.db.escape(c) for c in allowed_customers])
		return f"(`tab{doctype}`.customer IN ({formatted_customers}))"
	else:
		return "(1 != 1)"


def has_permission_contact(doc, user=None):
	return has_permission_contact_address(doc, user)


def permission_query_conditions_contact(user=None):
	return permission_query_conditions_contact_address("Contact", user)


def has_permission_address(doc, user=None):
	return has_permission_contact_address(doc, user)


def permission_query_conditions_address(user=None):
	return permission_query_conditions_contact_address("Address", user)


def has_permission_contact_address(doc, user=None):
	if is_system_user(user):
		return

	allowed_customers = set(get_user_customers())
	linked_customers = set([d.link_name for d in doc.get("links") if d.link_doctype == "Customer" and d.link_name])

	if doc.doctype == "Contact" and doc.user == user:
		return True

	if not linked_customers.intersection(allowed_customers):
		return False


def permission_query_conditions_contact_address(doctype, user):
	if is_system_user(user):
		return

	allowed_customers = get_user_customers()
	if allowed_customers:
		formatted_customers = ", ".join([frappe.db.escape(c) for c in allowed_customers])

		user_condition = f" OR `tabContact`.user = {frappe.db.escape(user)}" if doctype == "Contact" else ""

		condition = f"""(exists(
			select `tabDynamic Link`.name from `tabDynamic Link`
			where `tabDynamic Link`.parenttype = '{doctype}'
			and `tabDynamic Link`.parent = `tab{doctype}`.name
			and `tabDynamic Link`.link_doctype = 'Customer'
			and `tabDynamic Link`.link_name in ({formatted_customers})
			) {user_condition})"""

		return condition
	else:
		if doctype == "Contact":
			return f"(`tabContact`.user = {frappe.db.escape(user)})"
		else:
			return "(1 != 1)"


def get_user_customers(user=None):
	def generator():
		if user == "Guest":
			return []

		return frappe.db.sql_list("""
			select distinct c.name
			from `tabCustomer Portal User` cpu
			inner join `tabCustomer` c on c.name = cpu.parent and cpu.parenttype = 'Customer'
			where cpu.user = %s and c.disabled = 0
		""", user)

	if not user:
		user = frappe.session.user

	return frappe.local_cache("get_user_customers", user, generator)


def get_sales_persons_by_customers(customers):
	if not customers:
		return []

	customer_sales_persons = frappe.db.sql_list("""
		select distinct account_manager
		from `tabCustomer`
		where name in %s and account_manager is not null and account_manager != ''
	""", [customers])

	order_sales_persons = frappe.db.sql_list("""
		select distinct steam.sales_person
		from `tabSales Team` steam
		inner join `tabSales Order` so on so.name = steam.parent
		where so.docstatus < 2 and so.customer in %s
	""", [customers])

	sales_persons = list(set(customer_sales_persons + order_sales_persons))
	return sales_persons


def remove_prices_from_transaction(doc):
	def remove_prices_from_doc(doc):
		for df in doc.meta.fields:
			if df.fieldtype == "Currency":
				doc.set(df.fieldname, None)

	remove_prices_from_doc(doc)
	for d in doc.get_all_children():
		remove_prices_from_doc(d)


def remove_prices_from_dict(data, doctype):
	meta = frappe.get_meta(doctype)

	for k in data.keys():
		if not k:
			continue

		df = meta.get_field(k)
		if df and df.fieldtype == "Currency":
			data[k] = None


def are_item_prices_hidden(customer=None, hide_customer_item_prices=None):
	show_item_prices = frappe.db.get_single_value("Sales Portal Settings", "show_item_prices")
	if show_item_prices == "Hide Item Prices":
		return True
	elif show_item_prices == "Show Prices only for Customers":
		if not customer:
			return True

	if customer and not is_system_user():
		if hide_customer_item_prices is None:
			hide_customer_item_prices = cint(frappe.get_cached_value("Customer", customer, "hide_item_prices_from_customer_portal"))
		if hide_customer_item_prices:
			return True

	return False


def get_user_home_page(user):
	if user == "Guest":
		return

	if not is_system_user(user) and "Customer" in frappe.get_roles(user):
		return "/sales-portal"


def check_is_system_user(user=None):
	if not is_system_user(user):
		frappe.throw(_("Not permitted"), exc=frappe.PermissionError, title=_("Permission Error"))


def is_system_user(user=None):
	if not user:
		user = frappe.session.user

	def generator():
		return bool(frappe.db.get_value("User", {
			"name": user,
			"user_type": "System User",
			"enabled": 1,
		}))

	return frappe.local_cache("customer_permissions_is_system_user", user, generator)


def throw_doctype_permission_error(doctype):
	document_label = _(doctype)
	frappe.throw(
		_("Insufficient Permission for {0}").format(document_label),
		exc=frappe.PermissionError,
		title=_("Permission Error"),
	)


def check_customer_permission(customer=None, ptype="read", user=None, throw=True):
	doc = frappe.get_cached_doc("Customer", customer) if customer else None
	return frappe.has_permission("Customer", doc=doc, ptype=ptype, user=user, throw=throw)
