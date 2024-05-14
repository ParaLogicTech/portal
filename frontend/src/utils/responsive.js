import { computed, ref } from "vue";

const window_width = ref(window.innerWidth);

export const is_mobile_or_tablet = computed(() => {
	return is_mobile.value || is_tablet.value;
});

export const is_tablet = computed(() => {
	return window_width.value <= 1024 && !is_mobile.value;
});

export const is_mobile = computed(() => {
	return window_width.value < 640;
});

const update_width = () => {
	window_width.value = window.innerWidth;
}

window.addEventListener("resize", update_width);
window.addEventListener("orientationchange", update_width);
