<template>
	<div
		:class="{'card': true, 'selected': selected, 'clickable': selectable}"
		@click="this.handle_click"
	>
		<div
			v-if="selected"
			class="card-top-right"
			style="top: 3px; right: 5px;"
		>
			<CircleCheck class="w-5 text-purple-700" />
		</div>

		<slot></slot>
	</div>
</template>

<script>
import { CircleCheck } from 'lucide-vue-next';

export default {
	name: "SelectableCard",

	components: {CircleCheck},

	props: {
		selected: Boolean,
		selectable: Boolean,
	},

	methods: {
		handle_click() {
			if (this.selectable) {
				this.$emit('selected');
			}
		},
	}
}
</script>
