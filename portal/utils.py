import frappe


def set_thumbnail_for_line_items(doc):
	for row in doc.get("items"):
		if not row.get("item_code"):
			continue

		item_doc = frappe.get_cached_doc("Item", row.item_code)
		row.thumbnail = row.get("thumbnail") or item_doc.get("thumbnail")
		row.image = row.get("image") or item_doc.get("image")
