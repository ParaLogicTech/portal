import { createListResource } from 'frappe-ui'

export let item_list = createListResource({
	doctype: 'Item',
	fields: [
		'name',
		'item_name',
		'item_group',
		'brand',
		'stock_uom',
		'image',
	],
	filters: {
        disabled: 0,
    },
	orderBy: 'name',
	pageLength: 99999,
	cache: 'Items',
	transform(items) {
		return items.map((item) => {
			item.route = {
				name: 'Item',
				params: {
					item_code: item.name,
				},
			}
			return item
		})
	},
});

export let item_group_list = createListResource({
	doctype: 'Item Group',
	fields: [
		'name',
		'parent_item_group',
		'lft',
		'rgt',
		'image',
	],
	filters: {
        parent_item_group: ['is', 'set'],
    },
	orderBy: 'name',
	pageLength: 99999,
	cache: 'Item Groups',
	transform(item_groups) {
		return item_groups.map((d) => {
			d.route = {
				name: 'Item Group',
				params: {
					item_group: d.name,
				},
			}
			return d
		})
	},
});

export let brand_list = createListResource({
	doctype: 'Brand',
	fields: [
		'name',
		'image',
	],
	orderBy: 'name',
	pageLength: 99999,
	cache: 'Brands',
	transform(brands) {
		return brands.map((d) => {
			d.route = {
				name: 'Brand',
				params: {
					brand: d.name,
				},
			}
			return d
		})
	},
});

export let get_item = (item_code) => {
	return item_list.data.find((d) => d.name.toString() === item_code.toString())
}

export let get_item_group = (item_group) => {
	return item_group_list.data.find((d) => d.name.toString() === item_group.toString())
}

export let get_brand = (brand) => {
	return brand_list.data.find((d) => d.name.toString() === brand.toString())
}

export let reload_items_data = () => {
	item_list.reload();
	item_group_list.reload();
	brand_list.reload();
}
