import frappe
from frappe.utils import getdate


@frappe.whitelist()
def get_item_prices(customer=None):
	from erpnext.stock.report.item_prices.item_prices import get_item_price_data, process_filters

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

	item_prices_map, price_lists = get_item_price_data(filters)

	# Prepare Output
	out.price_list_currency = frappe.get_cached_value("Price List", out.price_list, "currency")

	out.item_prices_map = {}
	for item_code, d in item_prices_map.items():
		out.item_prices_map[item_code] = {
			"item_code": d.item_code,
			"price_list_rate": d.print_rate,
			"uom": d.uom,
			"stock_uom": d.stock_uom,
			"formatted_price_list_rate": frappe.utils.fmt_money(d.print_rate, currency=out.price_list_currency),
		}

	return out


@frappe.whitelist()
def get_item_stock_data():
	from erpnext.stock.doctype.item.item import convert_item_uom_for

	bin_data = frappe.db.sql("""
		select bin.item_code,
			sum(bin.actual_qty) as actual_qty,
			sum(bin.projected_qty) as projected_qty,
			item.stock_uom,
			item.sales_uom
		from `tabBin` bin
		inner join `tabItem` item on item.name = bin.item_code
		where item.disabled = 0
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
