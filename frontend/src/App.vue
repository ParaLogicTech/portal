<template>
	<div class="h-screen overflow-hidden" :style="{'max-height': `${height}px`}">
		<router-view />
	</div>
</template>

<script>
import viewheight from "@/utils/viewheight";
export default {
	name: 'App',

	data() {
		return {
			height: viewheight.get_height(100)
		}
	},

	methods: {
		update_height() {
			this.height = viewheight.get_height(100);
		},
	},

	mounted() {
		window.addEventListener("resize", this.update_height);
		window.addEventListener("orientationchange", this.update_height);
	}
}
</script>
