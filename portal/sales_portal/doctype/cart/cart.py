import frappe
from frappe import _
from frappe.utils import cint
from erpnext.controllers.selling_controller import SellingController
from frappe.model.mapper import get_mapped_doc
from crm.crm.doctype.sales_person.sales_person import get_sales_person_from_user
from portal.permissions import is_system_user


class Cart(SellingController):
	def __init__(self, *args, **kwargs):
		super(Cart, self).__init__(*args, **kwargs)
		self.status_map = [
			["Draft", None],
			["To Receive", "eval:self.order_confirmed"],
			["Ordered", "has_sales_order_or_invoice"],
			["Cancelled", "eval:self.docstatus==2"],
		]

	def get_feed(self):
		return None

	def validate(self):
		super().validate()
		self.validate_uom_is_integer("stock_uom", "qty")
		self.set_is_customer_cart()
		self.set_sales_person_from_user()
		self.validate_order_confirmed()
		self.set_status()

	def before_submit(self):
		self.validate_order_confirmed_before_submit()

	def on_submit(self):
		pass

	def on_cancel(self):
		self.update_status_on_cancel()
		self.db_set("order_confirmed", 0)

	def set_is_customer_cart(self):
		self.is_customer_cart = cint(not is_system_user(self.owner))

	def set_sales_person_from_user(self):
		if not self.get('sales_person'):
			self.sales_person = get_sales_person_from_user()

	def validate_order_confirmed(self):
		if self.order_confirmed and not self.get("items"):
			frappe.throw(_("Cannot Confirm Order because Cart is empty"))

	def validate_order_confirmed_before_submit(self):
		if not self.order_confirmed:
			frappe.throw(_("Cannot submit because Order is not confirmed"))

	def validate_can_modify(self):
		if self.docstatus == 1:
			frappe.throw(_("Cannot modify submitted Cart"))
		if self.docstatus == 2:
			frappe.throw(_("Cannot modify cancelled Cart"))
		if self.order_confirmed:
			frappe.throw(_("Cannot modify confirmed order cart"))

	def has_sales_order_or_invoice(self):
		if self.docstatus != 1:
			return False

		so = frappe.db.get_value("Sales Order", {"cart": self.name, "docstatus": ["!=", 0]})
		return so or False

	def get_item_row(self, item_code, add_row_if_missing=False):
		row = None
		for d in self.get("items"):
			if d.item_code == item_code:
				row = d
				break

		if not row and add_row_if_missing:
			row = self.append("items", frappe.new_doc("Cart Item"))
			row.item_code = item_code

		return row

	def remove_item_row(self, item_code):
		to_remove = []
		for d in self.get("items"):
			if d.item_code == item_code:
				to_remove.append(d)

		if to_remove:
			for d in to_remove:
				self.remove(d)

			for i, d in enumerate(self.get("items")):
				d.idx = i + 1


def validate_item_uom(item_code, uom):
	item_doc = frappe.get_cached_doc("Item", item_code)
	has_uom = any(d.uom for d in item_doc.uoms if d.uom == uom)
	if not has_uom:
		frappe.throw(_("UOM {0} not allowed for Item {1}").format(uom, item_code))


def make_sales_order(source_name, target_doc=None, ignore_permissions=False):
	def set_missing_values(source, target):
		if source.sales_person:
			target.sales_team = []
			target.append("sales_team", {
				"sales_person": source.sales_person,
				"allocated_percentage": 100
			})

		target.flags.ignore_permissions = ignore_permissions
		target.run_method("set_missing_values")
		target.run_method("calculate_taxes_and_totals")
		target.run_method("set_payment_schedule")

	return get_mapped_doc("Cart", source_name, {
		"Cart": {
			"doctype": "Sales Order",
			"validation": {
				"docstatus": ["=", 1]
			},
			"field_map": {
				"remarks": "remarks",
				"name": "cart",
			}
		},
		"Cart Item": {
			"doctype": "Sales Order Item",
			"field_map": {
				"name": "cart_item",
			},
		},
		"Sales Taxes and Charges": {
			"doctype": "Sales Taxes and Charges",
			"add_if_empty": True
		},
	}, target_doc, set_missing_values, ignore_permissions=ignore_permissions)


def on_doctype_update():
	frappe.db.add_index("Cart", ["customer", "status"])
