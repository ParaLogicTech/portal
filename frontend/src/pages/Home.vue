<template>
	<div class="max-w-3xl py-12 mx-auto">
		<ItemList/>
	</div>
</template>

<script>
import { Dialog } from 'frappe-ui'
import ItemList from '@/components/ItemList/ItemList.vue'

export default {
	name: 'Home',
	data() {
		return {
			showDialog: false,
		}
	},
	resources: {
		ping: {
			url: 'ping',
		},
	},
	components: {
		Dialog,
		ItemList,
	},
}
</script>
