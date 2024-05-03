import frappe
from frappe import _
from frappe.utils import getdate, flt, cast
from portal.sales_portal.doctype.cart.cart import validate_item_uom, make_sales_order
from erpnext.stock.get_item_details import get_conversion_factor


@frappe.whitelist()
def get_cart(customer=None, cart_id=None):
	cart_doc = get_cart_doc(customer, cart_id)
	return get_output(cart_doc)


def get_cart_doc(customer=None, cart_id=None):
	if not customer and not cart_id:
		frappe.throw(_("Customer or Cart ID is required"))

	cart_doc = None

	if cart_id:
		cart_doc = get_cart_by_id(cart_id)

	if not cart_doc and customer:
		cart_doc = get_cart_by_customer(customer, check_customer_exists=True)

	if not cart_doc:
		cart_doc = make_cart_doc(customer=customer)

	return cart_doc


def get_cart_by_customer(customer, check_customer_exists=False):
	if not customer:
		return None

	if check_customer_exists and not frappe.db.exists("Customer", customer):
		frappe.throw(_("Customer {0} does not exist").format(customer), exc=frappe.DoesNotExistError)

	cart_id = frappe.db.get_value("Cart", filters={
		"customer": customer, "status": "Draft", "docstatus": 0,
	}, fieldname="name", order_by="creation desc")

	if not cart_id:
		return None

	return get_cart_by_id(cart_id)


def get_cart_by_id(cart_id):
	if not cart_id:
		return None

	try:
		cart_doc = frappe.get_doc("Cart", cart_id)
		if cart_doc.docstatus == 0 and cart_doc.status == "Draft":
			return cart_doc

	except frappe.DoesNotExistError:
		return None


def make_cart_doc(customer):
	cart_doc = frappe.new_doc("Cart")
	cart_doc.customer = customer
	process_cart(cart_doc, for_save=False)
	return cart_doc


@frappe.whitelist()
def update_item_qty(
	item_code,
	qty,
	uom=None,
	customer=None,
	cart_id=None,
):
	# Validate arguments
	if not item_code:
		frappe.throw(_("Item Code not provided"))
	if not frappe.db.exists("Item", item_code):
		frappe.throw(_("Item {0} does not exists").format(item_code))

	cart_doc = get_cart_doc(customer, cart_id)
	cart_doc.validate_can_modify()

	_update_item_qty(cart_doc, item_code, qty, uom)

	return update_cart(cart_doc)


def _update_item_qty(cart_doc, item_code, qty, uom):
	qty = flt(qty)
	qty = max(qty, 0)

	if uom:
		validate_item_uom(item_code, uom)

	if qty > 0:
		# Add Item or Change Qty/UOM
		row = cart_doc.get_item_row(item_code, add_row_if_missing=True)
		row.qty = qty
		if uom:
			row.uom = uom

		previous_conversion_factor = row.conversion_factor
		row.conversion_factor = get_conversion_factor(item_code, row.uom).get("conversion_factor")

		if flt(previous_conversion_factor, 9) != flt(row.conversion_factor, 9):
			row.price_list_rate = None
			row.rate = None
			row.discount_percentage = None
			row.margin_rate_or_amount = None
	else:
		# Remove Item
		cart_doc.remove_item_row(item_code)


@frappe.whitelist()
def update_item_value(
	item_code,
	fieldname,
	value,
	customer=None,
	cart_id=None,
):
	allowed_fields = ["rate", "discount_percentage"]
	meta = frappe.get_meta("Cart Item")
	if fieldname not in allowed_fields or not meta.has_field(fieldname):
		frappe.throw(_("Field {0} not allowed").format(fieldname))

	cart_doc = get_cart_doc(customer, cart_id)
	cart_doc.validate_can_modify()

	_update_item_value(cart_doc, item_code, fieldname, value)

	return update_cart(cart_doc)


def _update_item_value(cart_doc, item_code, fieldname, value):
	row = cart_doc.get_item_row(item_code, add_row_if_missing=True)
	if not row:
		return

	df = frappe.get_meta("Cart Item").get_field(fieldname) or frappe._dict()
	value = cast(df.fieldtype, value)
	row.set(fieldname, value)

	if fieldname == "rate":
		row.discount_percentage = None
		row.margin_rate_or_amount = None
	elif fieldname == "discount_percentage":
		row.rate = None
		row.margin_rate_or_amount = None


@frappe.whitelist()
def update_cart_value(
	fieldname,
	value,
	customer=None,
	cart_id=None,
):
	allowed_fields = ["delivery_date", "customer_address", "contact_person", "remarks"]
	meta = frappe.get_meta("Cart")
	if fieldname not in allowed_fields or not meta.has_field(fieldname):
		frappe.throw(_("Field {0} not allowed").format(fieldname))

	cart_doc = get_cart_doc(customer, cart_id)
	cart_doc.validate_can_modify()

	_update_cart_value(cart_doc, fieldname, value)

	return update_cart(cart_doc)


def _update_cart_value(cart_doc, fieldname, value):
	df = frappe.get_meta("Cart").get_field(fieldname) or frappe._dict()
	value = cast(df.fieldtype, value)
	cart_doc.set(fieldname, value)


@frappe.whitelist()
def place_order(customer=None, cart_id=None):
	cart_doc = get_cart_doc(customer, cart_id)
	cart_doc.validate_can_modify()

	cart_doc.order_confirmed = 1
	process_cart(cart_doc, for_save=True)
	cart_doc.submit()

	sales_order = make_sales_order(cart_doc.name, ignore_permissions=True)
	sales_order.save()

	new_cart_doc = get_cart_doc(customer)
	out = get_output(new_cart_doc)
	out["sales_order"] = sales_order.name

	return out


def update_cart(cart_doc):
	process_cart(cart_doc, for_save=True)
	cart_doc.save()
	return get_output(cart_doc)


def process_cart(cart_doc, for_save):
	cart_doc.transaction_date = getdate()

	if not for_save:
		cart_doc.run_method("set_missing_values")
		cart_doc.run_method("calculate_taxes_and_totals")


def get_output(cart_doc):
	from portal.sales_portal.api.customers import get_customer_contacts, get_customer_addresses

	return {
		"doc": cart_doc,
		"addresses": get_customer_addresses(cart_doc.customer),
		"contacts": get_customer_contacts(cart_doc.customer),
	}
