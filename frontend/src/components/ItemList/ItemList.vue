<template>
	<div>
		<h1>Item List</h1>
	</div>
</template>

<script>
export default {
	name: "ItemList",

	data() {
		return {
			items: [],
		}
	},

	resources: {
		ping: {
			url: 'ping',
		},
	},

	components: {

	}
}
</script>
