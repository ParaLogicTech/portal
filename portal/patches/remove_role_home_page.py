import frappe


def execute():
	frappe.db.sql("update `tabRole` set home_page = null where name = 'Customer'")
