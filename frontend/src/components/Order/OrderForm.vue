<template>
	<div class="cart-form">
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
						@change="handle_cart_value_change('remarks', doc.remarks)"
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
						@change="handle_cart_value_change('delivery_date', doc.delivery_date)"
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
			<OrderItemsList
				:doc="doc"
				ref="items"
				@qty-changed="handle_qty_change"
				@value-changed="handle_item_value_change"
			/>
		</div>

		<!-- Totals Section -->
		<div class="section">
			<div class="section-grid grid-cols-4">
				<div class="col">
					<div class="col-row">
						<label>Total Qty</label>
						{{ format_number(doc.total_qty) }}
					</div>
<!--					<div class="col-row">-->
<!--						<label>Total Contents Qty</label>-->
<!--						{{ format_number(doc.total_alt_uom_qty) }}-->
<!--					</div>-->
				</div>

				<div class="col">
					<div class="col-row">
						<label>Total Amount</label>
						{{ format_currency(doc.total, doc.currency) }}
					</div>
				</div>

				<div class="col">
					<div class="col-row">
						<label>Taxes and Charges</label>
						{{ format_currency(doc.total_taxes_and_charges, doc.currency) }}
					</div>
				</div>

				<div class="col">
					<div class="col-row">
						<label>Grand Total</label>
						{{ format_currency(doc.grand_total, doc.currency) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AddressCard from "@/components/Customer/AddressCard.vue";
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import ContactCard from "@/components/Customer/ContactCard.vue";
import {FormControl} from "frappe-ui";
import OrderItemsList from "@/components/Order/OrderItemsList.vue";

export default {
	name: "OrderForm",

	components: {OrderItemsList, ContactCard, AddressCard, CustomerSelection, FormControl},

	props: {
		doc: Object,
		addresses: Array,
		contacts: Array,
	},

	data() {
	},

	methods: {
		refresh_view() {
			this.$refs.items.refresh_view();
		},

		handle_qty_change(row) {
			this.$emit("qty-changed", row);
		},

		handle_item_value_change(row, field, value) {
			this.$emit("item-value-changed", row, field, value);
		},

		handle_address_selected(address) {
			if (address.name == this.doc.customer_address) {
				return;
			}

			this.doc.customer_address = address.name;
			this.emit_update();
			this.handle_cart_value_change('customer_address', address.name);
		},

		handle_contact_selected(contact) {
			if (contact.name == this.doc.contact_person) {
				return;
			}

			this.doc.contact_person = contact.name;
			this.emit_update();
			this.handle_cart_value_change('contact_person', contact.name);
		},

		handle_cart_value_change(field, value) {
			this.$emit("cart-value-changed", field, value);
		},

		emit_update() {
			this.$emit('update:doc', this.doc);
		},
	},
}
</script>

<style lang="scss">
	.cart-form {
		.section {
			@apply py-4 px-5 border-b border-gray-300 text-md;

			.section-heading {
				@apply font-medium text-lg text-md mb-2 text-gray-700;
				margin-top: -2px;
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