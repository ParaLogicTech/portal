<template>
	<div>
		<div v-if="read_only">
			<div class="section">
				<div class="section-grid @2xl:grid-cols-2">
					<div class="col flex flex-col h-full">
						<div class="section-heading">Address</div>
						<AddressCard
							v-for="d in addresses"
							:address="d"
							:selectable="!read_only"
							:key="d.name"
							@address-selected="handle_address_selected"
							class="flex-1"
						/>
						<div v-if="!addresses?.length" class="section-message">
							No address selected
						</div>
					</div>

					<div class="col flex flex-col h-full">
						<div class="section-heading">Contact Person</div>
						<ContactCard
							v-for="d in contacts"
							:contact="d"
							:selectable="!read_only"
							:key="d.name"
							@contact-selected="handle_contact_selected"
							class="flex-1"
						/>
						<div v-if="!contacts?.length" class="section-message">
							No contact selected
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<!-- Address Section -->
			<div class="section">
				<h2 class="section-heading">Address</h2>

				<div v-if="!addresses?.length" class="section-message">
					Customer has no address
				</div>
				<div v-else class="section-grid @lg:grid-cols-2 @4xl:grid-cols-3">
					<AddressCard
						v-for="d in addresses"
						:address="d"
						:selected="d.name == doc.customer_address"
						:selectable="!read_only"
						:key="d.name"
						@address-selected="handle_address_selected"
					/>
				</div>
			</div>

			<!-- Contacts Section -->
			<div class="section">
				<h2 class="section-heading">Contact Person</h2>

				<div v-if="!contacts?.length" class="section-message">
					Customer has no contact persons
				</div>
				<div
					v-else
					class="section-grid @lg:grid-cols-2 @4xl:grid-cols-3"
				>
					<ContactCard
						v-for="d in contacts"
						:contact="d"
						:selected="d.name == doc.contact_person"
						:selectable="!read_only"
						:key="d.name"
						@contact-selected="handle_contact_selected"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ContactCard from "@/components/Customer/ContactCard.vue";
import AddressCard from "@/components/Customer/AddressCard.vue";

export default {
	name: "AddressAndContact",

	components: {AddressCard, ContactCard},

	props: {
		doc: Object,
		addresses: Array,
		contacts: Array,
		read_only: Boolean,
	},

	methods: {
		handle_address_selected(address) {
			this.$emit("address-selected", address)
		},
		handle_contact_selected(contact) {
			this.$emit("contact-selected", contact)
		},
	}
}
</script>
