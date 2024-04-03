{% include 'erpnext/selling/sales_common.js' %}

erpnext.selling.CartController = class CartController extends erpnext.selling.SellingController {
	setup() {
		super.setup();

		this.frm.custom_make_buttons = {
			'Sales Order': 'Sales Order',
			'Sales Invoice': 'Sales Invoice',
		};

		this.setup_queries();
	}

	refresh(doc, dt, dn) {
		super.refresh(doc, dt, dn);
		this.setup_buttons();
	}

	setup_buttons() {
		if (this.frm.doc.docstatus == 0) {
			this.add_get_latest_price_button();
		}
	}
};

cur_frm.script_manager.make(erpnext.selling.CartController);
