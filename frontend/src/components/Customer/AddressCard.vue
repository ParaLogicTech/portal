<template>
	<SelectableCard
		@selected="handle_selection"
		:selectable="selectable"
		:selected="selected"
		class="p-2.5 text-sm shadow-sm"
	>
		<h3 class="font-semibold mb-1 text-gray-900">
			{{ address.address_title }}
		</h3>
		<div
			class="font-normal"
			v-html="address.address_display"
		/>
	</SelectableCard>
</template>

<script>
import SelectableCard from "@/components/Utils/SelectableCard.vue";

export default {
	name: "AddressCard",

	components: {SelectableCard},

	props: {
		address: Object,
		selected: Boolean,
		selectable: Boolean,
	},

	methods: {
		handle_selection() {
			if (this.selectable) {
				this.$emit('address-selected', this.address);
			}
		},
	}
}
</script>
