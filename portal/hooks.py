from . import __version__ as app_version

app_name = "portal"
app_title = "Sales Portal"
app_publisher = "ParaLogic"
app_description = "Portal for Sales Persons and Customers"
app_email = "info@paralogic.io"
app_license = "GNU General Public License (v3)"

website_route_rules = [
	{"from_route": "/sales-portal/<path:app_path>", "to_route": "sales-portal"},
]

get_website_user_home_page = "portal.permissions.get_user_home_page"

doc_events = {
	"Customer": {
		"validate": "portal.overrides.customer_hooks.customer_validate",
		"on_update": "portal.overrides.customer_hooks.customer_on_update",
	},
	"User": {
		"validate": "portal.overrides.user_hooks.validate_customer_role",
	},
	"Sales Order": {
		"on_submit": "portal.overrides.sales_order_hooks.sales_order_on_submit",
	},
	"Item": {
		"validate": "portal.overrides.item_hooks.item_validate",
	},
	"Item Group": {
		"validate": "portal.overrides.item_hooks.item_group_validate",
	},
	"Brand": {
		"validate": "portal.overrides.item_hooks.brand_validate",
	},
}

doctype_js = {
	"Customer": "overrides/customer_hooks.js"
}

additional_doctype_permissions = {
	"Customer": [{"role": "Customer", "read": 1}],
	"Item": [{"role": "Customer", "read": 1}],
	"Item Group": [{"role": "Customer", "read": 1}],
	"Brand": [{"role": "Customer", "read": 1}],
	"Sales Person": [{"role": "Customer", "read": 1}],
	"Sales Order": [{"role": "Customer", "read": 1, "print": 1}],
	"Contact": [{"role": "Customer", "read": 1}],
	"Address": [{"role": "Customer", "read": 1}],
}

has_permission = {
	"Customer": "portal.permissions.has_permission_customer",
	"Item": "portal.permissions.has_permission_item",
	"Item Group": "portal.permissions.has_permission_item_group",
	"Brand": "portal.permissions.has_permission_brand",
	"Sales Person": "portal.permissions.has_permission_sales_person",
	"Sales Order": "portal.permissions.has_permission_sales_order",
	"Cart": "portal.permissions.has_permission_cart",
	"Contact": "portal.permissions.has_permission_contact",
	"Address": "portal.permissions.has_permission_address",
}

permission_query_conditions = {
	"Customer": "portal.permissions.permission_query_conditions_customer",
	"Item": "portal.permissions.permission_query_conditions_item",
	"Item Group": "portal.permissions.permission_query_conditions_item_group",
	"Brand": "portal.permissions.permission_query_conditions_brand",
	"Sales Person": "portal.permissions.permission_query_conditions_sales_person",
	"Sales Order": "portal.permissions.permission_query_conditions_sales_order",
	"Cart": "portal.permissions.permission_query_conditions_cart",
	"Contact": "portal.permissions.permission_query_conditions_contact",
	"Address": "portal.permissions.permission_query_conditions_address",
}

override_doctype_dashboards = {
	"User": "portal.overrides.user_hooks.override_user_dashboard",
}

after_migrate = "portal.install.setup_customer_role_profile"

fixtures = [
	{
		"doctype": "Custom Field",
		"filters": {
			"name": ["in", [
				'File-is_portal_optimized',

				'Item-show_in_customer_portal',
				'Item-featured_in_sales_portal',
				'Item-thumbnail',

				'Item Group-thumbnail',

				'Brand-thumbnail',

				'Customer-tab_sales_portal',
				'Customer-portal_users',

				'Sales Order-cart',
				'Sales Order Item-cart_item',
			]]
		}
	},
	{
		"doctype": "Property Setter",
		"filters": {
			"name": ["in", [
				'Item-main-make_attachments_public',
			]]
		}
	},
]
