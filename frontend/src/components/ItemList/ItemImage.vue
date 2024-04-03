<template>
	<div :class="rounded">
		<img
			v-if="item.image"
			class="w-auto h-full mx-auto object-cover"
			:class="rounded"
			:src="item.image"
			:alt="item.item_name"
		/>
		<div
			v-else
			class="w-full h-full bg-gray-50 flex items-center justify-center p-5 text-gray-300 text-center text-ellipsis overflow-hidden"
			:class="[rounded, font ? font : 'text-6xl']"
		>
			{{ item.name }}
		</div>
	</div>
</template>

<script>
export default {
	name: "ItemImage",

	props: {
		item: Object,
		rounded: String,
		font: String,
	},
}
</script>
