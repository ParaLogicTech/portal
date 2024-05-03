import frappe
from frappe import _


def get_data():

	return {
		'fieldname': 'cart',
		'transactions': [
			{
				'label': _("Order"),
				'items': ['Sales Order']
			},
		]
	}
