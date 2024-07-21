import frappe
from frappe.utils.fixtures import sync_fixtures
from portal.overrides.item_hooks import get_optimized_image, get_thumbnail


def execute():
	sync_fixtures(app="portal")

	items = frappe.get_all("Item", pluck="name", filters={"image": ["is", "set"]})
	item_groups = frappe.get_all("Item Group", pluck="name", filters={"image": ["is", "set"]})
	brands = frappe.get_all("Brand", pluck="name", filters={"image": ["is", "set"]})

	docs = [('Item', d) for d in items] + [('Item Group', d) for d in item_groups] + [('Brand', d) for d in brands]
	for doctype, name in docs:
		doc = frappe.get_doc(doctype, name)
		doc.image = get_optimized_image(doc.image, doc.doctype, doc.name, filename=doc.name)
		doc.thumbnail = get_thumbnail(doc.image)

		doc.db_set({
			"image": doc.image,
			"thumbnail": doc.thumbnail,
		}, update_modified=False)
