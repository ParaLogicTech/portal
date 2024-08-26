import frappe
from frappe.utils import getdate, cstr, cint
from frappe.client import get_list
from portal.permissions import check_customer_permission

mandatory_item_fields = ['name', 'stock_uom', 'sales_uom']


@frappe.whitelist()
def get_item_list(doctype="Item", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None):
	doctype = "Item"
	parent = None

	filters = frappe.parse_json(filters)

	# mandatory fields
	if not fields:
		fields = []
	for f in mandatory_item_fields:
		if f not in fields:
			fields.append(f)

	out = get_list(
		doctype=doctype,
		fields=fields,
		filters=filters,
		order_by=order_by,
		limit_start=start,
		limit_page_length=limit,
		group_by=group_by,
		parent=parent,
	)

	items_map = {}
	for item in out:
		items_map[item.name] = item
		item.uoms = []

	item_codes = list(items_map.keys())
	item_conditions = ""
	if filters:
		item_conditions = "where parent in %(item_codes)s"

	uom_data = []
	if item_codes:
		uom_data = frappe.db.sql(f"""
			select parent, idx, uom, conversion_factor
			from `tabUOM Conversion Detail`
			{item_conditions}
		""", {"item_codes": item_codes}, as_dict=1)

	for uom in uom_data:
		if uom.parent in items_map:
			items_map[uom.parent].uoms.append(uom)

	for item in items_map.values():
		item.uom = item.sales_uom or item.stock_uom
		item.uoms = sorted(item.uoms, key=lambda d: (cint(d.uom != item.uom), d.idx))

	return out


@frappe.whitelist()
def get_item_group_list(doctype="Item Group", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None):
	doctype = "Item Group"
	parent = None

	filters = frappe.parse_json(filters)

	return get_list(
		doctype=doctype,
		fields=fields,
		filters=filters,
		order_by=order_by,
		limit_start=start,
		limit_page_length=limit,
		group_by=group_by,
		parent=parent,
	)


@frappe.whitelist()
def get_brand_list(doctype="Brand", fields=None, filters=None, order_by=None, start=0, limit=20, group_by=None, parent=None):
	doctype = "Brand"
	parent = None

	filters = frappe.parse_json(filters)

	return get_list(
		doctype=doctype,
		fields=fields,
		filters=filters,
		order_by=order_by,
		limit_start=start,
		limit_page_length=limit,
		group_by=group_by,
		parent=parent,
	)


@frappe.whitelist()
def get_item_prices(customer=None):
	from erpnext.stock.report.item_prices.item_prices import get_item_price_data, process_filters
	from portal.permissions import permission_query_conditions_item

	frappe.has_permission("Item", "read", throw=True)
	check_customer_permission(customer, throw=True)

	out = frappe._dict({
		"item_prices_map": {},
		"price_list": None,
		"price_list_currency": None,
	})

	# Determine Price List
	out.price_list = frappe.db.get_single_value("Selling Settings", "selling_price_list")

	customer_price_list = None
	if customer:
		customer_price_list = frappe.get_cached_value("Customer", customer, "default_price_list")
	if customer_price_list:
		out.price_list = customer_price_list

	if not out.price_list:
		return out

	# Get Price Data
	date = getdate()
	filters = process_filters({
		"date": date,
		"customer": customer,
		"selected_price_list": out.price_list,
		"buying_selling": "Selling",
		"only_prices": 1,
		"filter_items_without_price": 1,
	})

	item_permission_cond = cstr(permission_query_conditions_item()).replace("`tabItem`", "`item`")
	item_prices_map, price_lists = get_item_price_data(filters,
		ignore_permissions=True, additional_conditions=item_permission_cond)

	# Prepare Output
	out.price_list_currency = frappe.get_cached_value("Price List", out.price_list, "currency")

	out.item_prices_map = {}
	for item_code, d in item_prices_map.items():
		out.item_prices_map[item_code] = {
			"item_code": d.item_code,
			"price_list_rate": d.print_price_list_rate,
			"pricing_rule_rate": d.pricing_rule_rate,
			"discount_percentage": d.discount_percentage,
			"discount_amount": d.discount_amount,
			"uom": d.uom,
			"stock_uom": d.stock_uom,
		}

	return out


@frappe.whitelist()
def get_item_stock_data():
	from erpnext.stock.doctype.item.item import convert_item_uom_for
	from portal.permissions import permission_query_conditions_item

	frappe.has_permission("Item", "read", throw=True)
	item_permission_cond = cstr(permission_query_conditions_item()).replace("`tabItem`", "`item`")
	item_permission_cond = f" and {item_permission_cond}" if item_permission_cond else ""

	bin_data = frappe.db.sql(f"""
		select bin.item_code,
			sum(bin.actual_qty) as actual_qty,
			sum(bin.projected_qty) as projected_qty,
			item.stock_uom,
			item.sales_uom
		from `tabBin` bin
		inner join `tabItem` item on item.name = bin.item_code
		where item.disabled = 0 {item_permission_cond}
		group by bin.item_code
		having sum(bin.actual_qty) != 0 or sum(bin.projected_qty) != 0
	""", as_dict=1)

	out = {}
	for d in bin_data:
		d.uom = d.sales_uom or d.stock_uom
		d.actual_qty = convert_item_uom_for(d.actual_qty, d.item_code, d.stock_uom, d.uom)
		d.projected_qty = convert_item_uom_for(d.projected_qty, d.item_code, d.stock_uom, d.uom)

		out[d.item_code] = d

	return out
