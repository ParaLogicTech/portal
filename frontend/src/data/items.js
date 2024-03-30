import { computed } from "vue";
import { createListResource } from 'frappe-ui'

export let item_list = createListResource({
	doctype: 'Item',
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
	cache: 'Items',
	transform(items) {
		return items.map((d) => {
			d.route = {
				name: 'Item',
				params: {
					item_code: d.name,
				},
			}

			d.is_end_of_life = d.end_of_life && moment().isSameOrAfter(moment(d.end_of_life), "date");
			return d;
		})
	},
});

export let active_items = computed(() => {
	return (item_list.data || []).filter((d) => {
		return !d.disabled
			&& d.is_sales_item
			&& !d.is_end_of_life
	})
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
});

export let get_item = (item_code) => {
	return (item_list.data || []).find((d) => d.name.toString() === item_code.toString())
}

export let get_item_group = (item_group) => {
	return (item_group_list.data || []).find((d) => d.name.toString() === item_group.toString())
}

export let get_brand = (brand) => {
	return (brand_list.data || []).find((d) => d.name.toString() === brand.toString())
}

export let reload_items_data = () => {
	item_list.reload();
	item_group_list.reload();
	brand_list.reload();
}
