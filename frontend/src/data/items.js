import { computed } from "vue";
import { createListResource, createResource } from 'frappe-ui'
import {createAlert} from "@/utils/alerts";
import {on_doctype_list_update} from "@/socket";
import {settings} from "@/data/settings";
import {reactive} from "vue";
import debounce from "frappe-ui/src/utils/debounce";

// Item Data
export const item_list = createListResource({
	doctype: 'Item',
	cache: 'Items',
	url: 'portal.sales_portal.api.items.get_item_list',
	fields: [
		'name',
		'item_name',
		'image',
		'thumbnail',
		'item_group',
		'brand',
		'stock_uom',
		'sales_uom',
		'disabled',
		'end_of_life',
		'is_sales_item',
	],
	orderBy: 'name',
	pageLength: 99999,
	transform(items) {
		return items.map((d) => {
			d.item_code = d.name;

			d.is_end_of_life = d.end_of_life && moment().isSameOrAfter(moment(d.end_of_life), "date");

			d.uom = d.sales_uom || d.stock_uom;

			d.route = {
				name: 'Item',
				params: {
					item_code: d.name,
				},
			}

			return d;
		})
	},
});

export const get_item = (item_code) => {
	return (item_list.dataMap || {})[item_code];
}

export const active_items = computed(() => {
	let active_items = (item_list.data || []).filter((d) => {
		return !d.disabled
			&& d.is_sales_item
			&& !d.is_end_of_life
	});

	if (settings.value.hide_items_without_image) {
		active_items = active_items.filter((d) => d.image);
	}

	return active_items;
});

// Item Group Data
export const item_group_list = createListResource({
	doctype: 'Item Group',
	cache: 'Item Groups',
	url: 'portal.sales_portal.api.items.get_item_group_list',
	fields: [
		'name',
		'parent_item_group',
		'lft',
		'rgt',
		'image',
		'thumbnail',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export const in_item_group = (item_group_item, item_group_filter) => {
	if (!item_group_filter) {
		return true;
	}
	if (!item_group_item && item_group_filter) {
		return false;
	}

	let ig_item = get_item_group(item_group_item);
	let ig_filter = get_item_group(item_group_filter);
	if (ig_item && ig_filter) {
		return (
			ig_item.lft >= ig_filter.lft
			&& ig_item.rgt <= ig_filter.rgt
		);
	} else {
		return item_group_item === item_group_filter;
	}
}

export const get_item_group = (item_group) => {
	return (item_group_list.dataMap || {})[item_group];
}

export const active_item_groups = computed(() => {
	let item_groups_with_items = new Set();

	// Item Groups with directly linked items
	for (let item of active_items.value) {
		item_groups_with_items.add(item.item_group);
	}

	// Item Groups with items in child item groups
	for (let item_group of new Set(item_groups_with_items)) {
		let ancestors = get_item_group_ancestors(item_group);
		for (let ancestor of ancestors) {
			item_groups_with_items.add(ancestor);
		}
	}

	return (item_group_list.data || []).filter(d => {
		return (
			d.parent_item_group
			&& item_groups_with_items.has(d.name)
		)
	})
})

const get_item_group_ancestors = (item_group) => {
	let ig = get_item_group(item_group);

	let ancestors = [];
	while (ig?.parent_item_group) {
		ancestors.push(ig.parent_item_group);
		ig = get_item_group(ig.parent_item_group);
	}

	return ancestors;
}

// Brand Data
export const brand_list = createListResource({
	doctype: 'Brand',
	cache: 'Brands',
	url: 'portal.sales_portal.api.items.get_brand_list',
	fields: [
		'name',
		'image',
		'thumbnail',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export const get_brand = (brand) => {
	return (brand_list.dataMap || {})[brand];
}

export const active_brands = computed(() => {
	let brands_with_items = new Set();
	for (let item of active_items.value) {
		brands_with_items.add(item.brand);
	}

	return (brand_list.data || []).filter(d => brands_with_items.has(d.name));
});

// Price Data
export const standard_prices = createResource({
	url: 'portal.sales_portal.api.items.get_item_prices',
	cache: 'Standard Selling Prices',
});

// Specific Customer Data With Prices
const customer_item_price_resources = reactive({});
export const get_item_prices_resource = (customer) => {
	if (!customer) {
		return standard_prices;
	}

	if (!customer_item_price_resources[customer]) {
		let resource = customer_item_price_resources[customer] = createResource({
			url: 'portal.sales_portal.api.items.get_item_prices',
			params: {
				customer: customer
			},
		});

		resource.reload().catch(e => {
			createAlert({"title": `Error Loading Prices for Customer ${customer}`, "message": e, "variant": "error"});
		});
	}

	return customer_item_price_resources[customer]
};

// Stock Data
export const item_stock = createResource({
	url: 'portal.sales_portal.api.items.get_item_stock_data',
});

// Reload Items
export const reload_items_data = () => {
	reload_items();
	reload_item_groups();
	reload_brands();

	item_stock.reload().catch(e => {
		createAlert({"title": "Error Loading Item Stock", "message": e, "variant": "error"});
	});
	standard_prices.reload().catch(e => {
		createAlert({"title": "Error Loading Standard Prices", "message": e, "variant": "error"});
	});
}

const reload_items = () => {
	item_list.reload().catch(e => {
		createAlert({"title": "Error Loading Items", "message": e, "variant": "error"});
	});
}

const debounced_reload_items = debounce(reload_items, 500);

const reload_item_groups = () => {
	item_group_list.reload().catch(e => {
		createAlert({"title": "Error Loading Item Groups", "message": e, "variant": "error"});
	});
}

const debounced_reload_item_groups = debounce(reload_item_groups, 500);

const reload_brands = () => {
	brand_list.reload().catch(e => {
		createAlert({"title": "Error Loading Brands", "message": e, "variant": "error"});
	});
}

const debounced_reload_brands = debounce(reload_brands, 500);

export const setup_item_data_realtime = () => {
	on_doctype_list_update($socket, "Item", (name) => {
		if (!item_list.list.loading) {
			debounced_reload_items();
		}
	});

	on_doctype_list_update($socket, "Item Group", (name) => {
		if (!item_group_list.list.loading) {
			debounced_reload_item_groups();
		}
	});

	on_doctype_list_update($socket, "Brand", (name) => {
		if (!brand_list.list.loading) {
			debounced_reload_brands();
		}
	});
};
