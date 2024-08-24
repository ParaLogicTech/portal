import frappe
from erpnext import get_default_company
from frappe.utils import get_system_timezone
from portal.permissions import is_system_user


@frappe.whitelist()
def get_settings():
	settings_doc = frappe.get_cached_doc("Sales Portal Settings", None)
	price_list_settings = frappe.get_cached_doc("Price List Settings", None)

	out = frappe._dict({
		"company": settings_doc.company or get_default_company(),
		"hide_items_without_image": settings_doc.hide_items_without_image,
		"show_customer_description": settings_doc.show_customer_description,
		"stock_availability_based_on": settings_doc.stock_availability_based_on,
		"show_stock_availability": settings_doc.show_stock_availability,
		"sales_order_email_template": settings_doc.sales_order_email_template,
		"default_item_list_view_type": settings_doc.default_item_list_view_type,
		"customer_item_list_view_type": settings_doc.customer_item_list_view_type,

		# Item Group / Brand Ordering
		"item_group_order": price_list_settings.item_group_order,
		"brand_order": price_list_settings.brand_order,

		# Permissions
		"is_system_user": is_system_user(),

		# Formatting settings
		"number_format": frappe.get_system_settings("number_format"),
		"rounding_method": frappe.get_system_settings("rounding_method"),
		"date_format": frappe.get_system_settings("date_format"),
		"float_precision": frappe.get_system_settings("float_precision"),
		"currency_precision": frappe.get_system_settings("currency_precision"),
		"first_day_of_the_week": frappe.get_system_settings("first_day_of_the_week"),
		"system_timezone": get_system_timezone(),
		"user_timezone": frappe.db.get_value("User", frappe.session.user, "time_zone"),
	})

	return out
