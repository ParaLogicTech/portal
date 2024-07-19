import frappe


def sales_order_on_submit(doc, method):
	update_cart_status(doc)


def update_cart_status(doc):
	if doc.get("cart"):
		cart = frappe.get_doc("Cart", doc.cart)
		cart.set_status(update=True)
		cart.notify_update()
