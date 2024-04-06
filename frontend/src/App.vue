<template>
	<div class="h-screen overflow-hidden" :style="{'max-height': `${height}px`}">
		<RouterView />
	</div>
	<Alerts/>
</template>

<script>
import viewheight from "@/utils/viewheight";
import Alerts from "@/components/Utils/Alerts.vue";
export default {
	name: 'App',
	components: {Alerts},

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
