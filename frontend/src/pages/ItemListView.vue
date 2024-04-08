<template>
	<ItemList
		class="h-full w-full"
	/>
</template>

<script>
import ItemList from '@/components/ItemList/ItemList.vue';

export default {
	name: 'ItemListView',

	components: {
		ItemList,
	},

	pageMeta() {
		return {
			title: 'Item List',
		}
	},
}
</script>
