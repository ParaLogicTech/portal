<template>
	<div class="flex flex-col h-full">
		<CartHeader class="top-bar-height px-3 py-1 border-b border-gray-400 shadow-sm"/>

		<div class="cart-form h-full overflow-y-auto">
			<!-- First Section -->
			<div class="section">
				<div class="section-grid grid-cols-3">
					<div class="col">
						<div class="col-row">
							<label for="cart_customer">Customer</label>
							<CustomerSelection id="cart_customer" />
						</div>
					</div>

					<div class="col">
						<FormControl
							type="textarea"
							label="Remarks"
							v-model="doc.remarks"
							variant="subtle"
							class="col-row"
						/>
					</div>

					<div class="col">
						<FormControl
							type="date"
							label="Order Date"
							v-model="doc.transaction_date"
							variant="subtle"
							:disabled="true"
							class="col-row"
						/>

						<FormControl
							type="date"
							label="Expected Delivery Date"
							v-model="doc.delivery_date"
							variant="subtle"
							class="col-row"
						/>
					</div>
				</div>
			</div>

			<!-- Address Section -->
			<div class="section">
				<h2 class="section-heading">Address</h2>

				<div v-if="!addresses?.length" class="section-message">
					Customer has no address
				</div>
				<div v-else class="section-grid grid-cols-3">
					<AddressCard
						v-for="d in addresses"
						:address="d"
						:selected="d.name == doc.customer_address"
						:selectable="true"
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
					class="section-grid grid-cols-3"
				>
					<ContactCard
						v-for="d in contacts"
						:contact="d"
						:selected="d.name == doc.contact_person"
						:selectable="true"
						:key="d.name"
						@contact-selected="handle_contact_selected"
					/>
				</div>
			</div>

			<!-- Items Section -->
			<div class="section">
				<h2 class="section-heading">Items</h2>
				<div class="section-message">
					Work in Progress
				</div>
			</div>
		</div>

		<div class="top-bar-height flex justify-between items-center px-3 py-1 border-t border-gray-400 shadow-sm">
			<div>WIP</div>
		</div>
	</div>
</template>

<script>
import CartHeader from "@/components/Cart/CartHeader.vue";
import {ShoppingBag} from "lucide-vue-next";
import {cart} from "@/data/cart";
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import {Textarea, FormControl} from "frappe-ui";
import AddressCard from "@/components/Customer/AddressCard.vue";
import ContactCard from "@/components/Customer/ContactCard.vue";

export default {
	name: "OrderCartView",

	components: {ContactCard, AddressCard, CustomerSelection, CartHeader, ShoppingBag, Textarea, FormControl},

	data() {
		return {
			cart: cart,

			cart_model: {
				items: [],
			},
		}
	},

	methods: {
		handle_address_selected(address) {
			if (address.name == this.doc.customer_address) {
				return;
			}
			cart.update_cart_value('customer_address', address.name);
		},

		handle_contact_selected(contact) {
			if (contact.name == this.doc.contact_person) {
				return;
			}
			cart.update_cart_value('contact_person', contact.name);
		},
	},

	computed: {
		addresses() {
			return cart.addresses || [];
		},

		contacts() {
			return cart.contacts || [];
		},

		doc() {
			return this.cart?.doc || {};
		},
	}
}
</script>

<style lang="scss">
	.cart-form {
		.section {
			@apply py-4 px-5 border-b border-gray-300 text-md;

			.section-heading {
				@apply font-medium text-lg text-md mb-2 text-gray-700;
				margin-top: -5px;
			}

			.section-message {
				@apply font-normal text-gray-600;
			}

			.section-grid {
				@apply grid gap-4;
			}
		}

		label {
			@apply block text-sm text-gray-700 font-medium mb-0.5;
		}

		.col-row:not(:first-child) {
			@apply mt-3;
		}
	}
</style>
