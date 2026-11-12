<template>
	<span v-if="row.is_free_item && row.rate == 0" class="text-green-800 font-medium">
		Free
	</span>
	<span v-else>
		{{ format_currency(row.rate, doc.currency) }}
	</span>
</template>

<script>
export default {
	name: "OrderItemRate",

	props: {
		doc: {
			type: Object,
			required: true,
		},

		row: {
			type: Object,
			required: true,
		},
	},
}
</script>
