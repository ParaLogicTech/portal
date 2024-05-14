import { computed, ref } from "vue";

const window_width = ref(window.innerWidth);

export const is_mobile = computed(() => {
	return window_width.value < 768;
});

const update_width = () => {
	window_width.value = window.innerWidth;
}

window.addEventListener("resize", update_width);
window.addEventListener("orientationchange", update_width);
