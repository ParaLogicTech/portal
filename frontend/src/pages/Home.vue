<template>
	<div class="max-w-5xl mx-auto">
		<ItemList/>
	</div>
</template>

<script>
import ItemList from '@/components/ItemList/ItemList.vue'

export default {
	name: 'Home',
	data() {
		return {
			showDialog: false,
		}
	},
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
