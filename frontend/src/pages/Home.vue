<template>
	<div class="h-screen overflow-hidden">
		<div class="flex h-full">
			<div class="flex-none w-[350px] border-r border-gray-400 py-2 px-3">
				Cart Component
			</div>
			<ItemList class="h-full w-full"/>
		</div>
	</div>
</template>

<script>
import ItemList from '@/components/ItemList/ItemList.vue'

export default {
	name: 'Home',

	components: {
		ItemList,
	},

	pageMeta() {
		return {
			title: 'Home Page Title',
		}
	},
}
</script>
