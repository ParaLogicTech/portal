frappe.listview_settings['Cart'] = {
	add_fields: ["status"],

	get_indicator: function (doc) {
		let colors_map = {
			"Draft": "grey",
			"To Receive": "orange",
			"Ordered": "green",
			"Expired": "light-grey",
		}

		return [__(doc.status), colors_map[doc.status], "status,=," + doc.status];
	},

	has_indicator_for_draft: 1,
	filters: [["status", "=", "To Receive"]]
}
