<template>
	<SelectableCard
		@selected="handle_selection"
		:selectable="selectable"
		:selected="selected"
		class="p-2.5 text-sm shadow-sm flex flex-col gap-1.5"
	>
		<h3 class="font-semibold text-gray-900">
			{{ contact.contact_display }}
		</h3>
		<div class="font-normal flex flex-col gap-0.5">
			<div v-if="contact.mobile_no">
				<Smartphone class="contact-card-icon" />
				{{ contact.mobile_no }}
			</div>
			<div v-if="contact.phone">
				<Phone class="contact-card-icon" />
				{{ contact.phone }}
			</div>
			<div v-if="contact.email_id">
				<AtSign class="contact-card-icon" />
				{{ contact.email_id }}
			</div>
		</div>
	</SelectableCard>
</template>

<script>
import SelectableCard from "@/components/Utils/SelectableCard.vue";
import {Phone, AtSign, Smartphone} from "lucide-vue-next";

export default {
	name: "ContactCard",

	components: {SelectableCard, Phone, AtSign, Smartphone},

	props: {
		contact: Object,
		selected: Boolean,
		selectable: Boolean,
	},

	methods: {
		handle_selection() {
			if (this.selectable) {
				this.$emit('contact-selected', this.contact);
			}
		},
	}
}
</script>

<style>
.contact-card-icon {
	@apply inline;
	width: 12px;
	height: 12px;
}
</style>
