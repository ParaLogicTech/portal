<template>
	<div>
		<img v-if="item.image" class="w-auto h-full mx-auto object-cover" :src="item.image" :alt="item.item_name">
		<div v-else class="w-full h-full bg-gray-50 flex items-center justify-center p-5 text-6xl text-gray-300 text-center text-ellipsis overflow-hidden">
			{{ item.name }}
		</div>
	</div>
</template>

<script>
export default {
	name: "ItemImage",

	props: {
		item: Object,
	},
}
</script>
