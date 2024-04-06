<template>
	<div class="alerts-container">
		<Toast
			v-for="a in alerts"
			:key="a.key"
			:title="a.title"
			:message="a.message"
			:timeout="a.timeout"
			:variant="a.variant || 'info'"
			:icon="a.icon"
			:fade="true"
			class="mr-4 mb-3"
			@close="handle_close(a)"
		/>
	</div>
</template>

<script>
import Toast from "@/components/Utils/Toast.vue";
import {alerts} from "@/utils/alerts";

export default {
	name: "Alerts",

	components: {
		Toast,
	},

	methods: {
		handle_close(a) {
			let index = alerts.value.indexOf(a);
			if (index !== -1) {
				alerts.value.splice(index, 1);
			}
		}
	},

	data() {
		return {
			alerts: alerts,
		}
	},
}
</script>

<style>
.alerts-container {
	position: fixed;
	right: 0;
	bottom: 0;
	z-index: 1000;
	pointer-events: none;
	opacity: 0.95;
}
</style>
