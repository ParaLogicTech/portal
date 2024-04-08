<template>
	<ItemGroup
		class="h-full w-full"
	/>
</template>

<script>
import ItemGroup from '@/components/ItemGroupList/ItemGroup.vue';

export default {
	name: 'ItemGroupListView',

	components: {
		ItemGroup,
	},

	pageMeta() {
		return {
			title: 'Item Group List',
		}
	},
}
</script>
