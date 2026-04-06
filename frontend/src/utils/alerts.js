import {ref, reactive} from "vue";
import {session, sessionUser} from "@/data/session";

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

export function handleRequestError(e, title) {
	title = title || "An error occurred";

	if (e.response?.status == 401) {
		redirectToLogin();
		return;
	} else if (e.response?.status == 403) {
		let current_user = sessionUser();
		if (!current_user && session.user) {
			redirectToLogin();
			return;
		}
	}

	createAlert({"title": title, "message": e, "variant": "error"});
}

export function redirectToLogin() {
	createAlert({
		"title": "Session Expired",
		"message": "Redirecting to login page...",
		"variant": "warning"
	});

	setTimeout(() => {
		window.location.href = `/login?redirect-to=${encodeURIComponent(
			window.location.pathname + window.location.search
		)}`;
	}, 1000);
}
