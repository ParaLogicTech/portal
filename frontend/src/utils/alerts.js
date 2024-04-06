import {ref, reactive, computed} from "vue";

export let alerts = ref([]);
let alert_count = 0;

export function createAlert(options) {
	let alert = reactive({
		show: false,
		key: "alert-" + alert_count++,
		...options,
	});

	alerts.value.push(alert);
}
