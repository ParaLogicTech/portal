frappe.ui.form.on("Customer", {
	setup(frm) {
		frm.set_query("user", "portal_users", () => {
			return {
				filters: {
					user_type: "Website User",
					ignore_user_type: 1,
				}
			}
		});

		frm.set_query("user_contact", "portal_users", () => {
			return {
				query: "frappe.contacts.doctype.contact.contact.contact_query",
				filters: {
					link_doctype: "Customer",
					link_name: frm.doc.name,
				}
			};
		});
	},

	refresh(frm) {
		let user_field = frm.get_docfield("portal_users", "user");
		user_field.get_route_options_for_new_doc = () => {
			return {
				user_type: "Website User",
				role_profile_name: "Customer",
			};
		}
	},

	set_user_contact_display(frm, row) {
		return frappe.call({
			method: "erpnext.accounts.party.get_contact_details",
			args: {
				contact: row.user_contact || "",
			},
			callback: function(r) {
				if (r.message) {
					frappe.model.set_value(row.doctype, row.name, "user_contact_display", r.message.contact_display);
				}
			}
		});
	},
});

frappe.ui.form.on("Customer User", {
	user_contact(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		frm.events.set_user_contact_display(frm, row);
	}
});
