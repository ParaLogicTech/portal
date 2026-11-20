import frappe
import erpnext
from erpnext.accounts.doctype.pricing_rule.utils import get_applied_pricing_rules


def get_sales_portal_company():
	return (
		frappe.get_cached_value("Sales Portal Settings", None, "company")
		or erpnext.get_default_company()
	)


def set_thumbnail_for_line_items(doc_dict):
	for row in doc_dict.get("items"):
		if not row.get("item_code"):
			continue

		item_doc = frappe.get_cached_doc("Item", row.item_code)
		row.thumbnail = row.get("thumbnail") or item_doc.get("thumbnail")
		row.image = row.get("image") or item_doc.get("image")


def set_is_mix_and_match_for_line_items(doc_dict):
	for row in doc_dict.get("items"):
		row.mix_and_match = 0
		if not row.get("pricing_rules") and not row.get("is_free_item"):
			continue

		pricing_rules = get_applied_pricing_rules(row.get("pricing_rules"))
		for pricing_rule in pricing_rules:
			try:
				pr_doc = frappe.get_cached_doc("Pricing Rule", pricing_rule)
				if pr_doc.get("mix_and_match"):
					row.mix_and_match = 1
			except frappe.DoesNotExistError:
				pass


def set_print_pricing_rule_descriptions(doc, doc_dict):
	doc.set_pricing_rules_before_print()
	doc_dict.print_pricing_rule_descriptions = doc.get("print_pricing_rule_descriptions") or []
	for dict_row in doc_dict.get("items"):
		doc_row = doc.getone("items", {"name": dict_row.name})
		if not doc_row:
			dict_row.print_pricing_rule_descriptions = []
			continue

		dict_row.print_pricing_rule_descriptions = doc_row.get("print_pricing_rule_descriptions") or []
