import { computed } from "vue";
import { createListResource, createResource } from 'frappe-ui'
import {createAlert} from "@/utils/alerts";
import {on_doctype_list_update} from "@/socket";
import {settings} from "@/data/settings";

// Item Data
export let item_list = createListResource({
	doctype: 'Item',
	cache: 'Items',
	url: 'portal.sales_portal.api.items.get_item_list',
	fields: [
		'name',
		'item_name',
		'image',
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

export let get_item = (item_code) => {
	return (item_list.dataMap || {})[item_code];
}

export let active_items = computed(() => {
	let active_items = (item_list.data || []).filter((d) => {
		return !d.disabled
			&& d.is_sales_item
			&& !d.is_end_of_life
	});

	if (settings.data?.hide_items_without_image) {
		active_items = active_items.filter((d) => d.image);
	}

	return active_items;
});

// Item Group Data
export let item_group_list = createListResource({
	doctype: 'Item Group',
	cache: 'Item Groups',
	fields: [
		'name',
		'parent_item_group',
		'lft',
		'rgt',
		'image',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export let in_item_group = (item_group_item, item_group_filter) => {
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

export let get_item_group = (item_group) => {
	return (item_group_list.dataMap || {})[item_group];
}

export let active_item_groups = computed(() => {
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

let get_item_group_ancestors = (item_group) => {
	let ig = get_item_group(item_group);

	let ancestors = [];
	while (ig?.parent_item_group) {
		ancestors.push(ig.parent_item_group);
		ig = get_item_group(ig.parent_item_group);
	}

	return ancestors;
}

// Brand Data
export let brand_list = createListResource({
	doctype: 'Brand',
	cache: 'Brands',
	fields: [
		'name',
		'image',
	],
	orderBy: 'name',
	pageLength: 99999,
});

export let get_brand = (brand) => {
	return (brand_list.dataMap || {})[brand];
}

// Price Data
export let standard_prices = createResource({
	url: 'portal.sales_portal.api.items.get_item_prices',
	cache: 'Standard Selling Prices',
});

// Stock Data
export let item_stock = createResource({
	url: 'portal.sales_portal.api.items.get_item_stock_data',
});

// Reload Items
export let reload_items_data = () => {
	item_list.reload().catch(e => {
		createAlert({"title": "Error loading Items", "message": e, "variant": "error"});
	});
	item_group_list.reload().catch(e => {
		createAlert({"title": "Error loading Item Groups", "message": e, "variant": "error"});
	});
	brand_list.reload().catch(e => {
		createAlert({"title": "Error loading Brands", "message": e, "variant": "error"});
	});
	item_stock.reload().catch(e => {
		createAlert({"title": "Error loading Item Stock", "message": e, "variant": "error"});
	});
	standard_prices.reload().catch(e => {
		createAlert({"title": "Error loading Standard Prices", "message": e, "variant": "error"});
	});
}

export let setup_item_data_realtime = () => {
	on_doctype_list_update($socket, "Item", (name) => {
		if (item_list.originalData?.find((d) => d.name === name)) {
			item_list.fetchOne.submit(name)
		}
	})
};
