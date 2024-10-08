<template>
	<div class="form @container">
		<div
			class="loading-overlay"
			v-if="loading"
		>
			<div class="loading-text">Loading...</div>
		</div>

		<!-- First Section -->
		<div class="section">
			<div class="section-grid @2xl:grid-cols-3">
				<div class="col">
					<FormControl
						v-if="read_only"
						type="text"
						label="Customer"
						v-model="doc.customer_name"
						variant="subtle"
						class="col-row"
						:disabled="true"
					/>
					<div v-else class="col-row space-y-1.5">
						<label>Customer</label>
						<CustomerSelection />
					</div>

					<FormControl
						type="text"
						label="Sales Person"
						v-model="sales_person"
						variant="subtle"
						class="col-row"
						:disabled="true"
					/>
				</div>

				<div class="col">
					<FormControl
						type="textarea"
						label="Remarks"
						v-model="doc.remarks"
						variant="subtle"
						class="col-row"
						:rows="5"
						@change="handle_cart_value_change('remarks', doc.remarks)"
						:disabled="read_only"
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
						:disabled="read_only"
					/>
				</div>
			</div>
		</div>

		<div class="section">
			<div class="section-grid @2xl:grid-cols-2">
				<div class="col">
					<FormControl
						type="text"
						label="Purchase Order #"
						v-model="doc.po_no"
						variant="subtle"
						class="col-row"
						@change="handle_cart_value_change('po_no', doc.po_no)"
						:disabled="read_only"
					/>
				</div>
				<div class="col">
					<FormControl
						type="date"
						label="Purchase Order Date"
						v-model="doc.po_date"
						variant="subtle"
						class="col-row"
						@change="handle_cart_value_change('po_date', doc.po_date)"
						:disabled="read_only"
					/>
				</div>
			</div>
		</div>

		<AddressAndContact
			:doc="doc"
			:addresses="addresses"
			:contacts="contacts"
			:read_only="read_only"
			@address-selected="handle_address_selected"
			@contact-selected="handle_contact_selected"
		/>

		<!-- Items Section -->
		<OrderItemsList
			v-if="!is_mobile"
			:doc="doc"
			:read_only="read_only"
			ref="items"
			class="section"
			@qty-changed="handle_qty_change"
			@value-changed="handle_item_value_change"
			@item-removed="handle_item_removed"
		/>
		<CompactOrderItemsList
			v-else
			:doc="doc"
			:read_only="read_only"
			:show_empty_explore_button="!read_only"
			border_color_class="border-gray-300"
			:no_last_border="true"
			ref="compact_items"
			class="section !p-0"
			@qty-changed="handle_qty_change"
			@value-changed="handle_item_value_change"
			@item-removed="handle_item_removed"
		/>

		<!-- Totals Section -->
		<div class="section">
			<div class="section-grid @xs:grid-cols-2 @2xl:grid-cols-4">
				<div class="col">
					<div class="col-row space-y-1.5">
						<label>Total Qty</label>
						<div>{{ format_number(doc.total_qty) }}</div>
					</div>
<!--					<div class="col-row space-y-1.5">-->
<!--						<label>Total Contents Qty</label>-->
<!--						<div>{{ format_number(doc.total_alt_uom_qty) }}</div>>-->
<!--					</div>-->
				</div>

				<div class="col">
					<div class="col-row space-y-1.5">
						<label>Total Amount</label>
						<div>{{ format_currency(doc.total, doc.currency) }}</div>
					</div>
				</div>

				<div class="col">
					<div class="col-row space-y-1.5">
						<label>Taxes and Charges</label>
						<div>{{ format_currency(doc.total_taxes_and_charges, doc.currency) }}</div>
					</div>
				</div>

				<div class="col">
					<div class="col-row space-y-1">
						<label>Grand Total</label>
						<div class="font-medium text-lg">{{ format_currency(doc.grand_total, doc.currency) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";
import {FormControl} from "frappe-ui";
import OrderItemsList from "@/components/Order/OrderItemsList.vue";
import AddressAndContact from "@/components/Order/AddressAndContact.vue";
import {is_mobile} from "@/utils/responsive";
import CompactOrderItemsList from "@/components/Order/CompactOrderItemsList.vue";

export default {
	name: "OrderForm",

	components: {CompactOrderItemsList, AddressAndContact, OrderItemsList, CustomerSelection, FormControl},

	props: {
		doc: Object,
		addresses: Array,
		contacts: Array,
		loading: Boolean,
		read_only: Boolean,
	},

	methods: {
		select_item(item_code) {
			this.$refs.items?.select_item(item_code);
			this.$refs.compact_items?.select_item(item_code);
		},

		refresh_view() {
			this.$refs.items?.refresh_view();
			this.$refs.compact_items?.refresh_view();
		},

		handle_qty_change(row) {
			this.emit_update();
			this.$emit("qty-changed", row);
		},

		handle_item_removed(row) {
			this.emit_update();
			this.$emit("item-removed", row);
		},

		handle_item_value_change(row, field, value) {
			this.emit_update();
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

	computed: {
		is_mobile() {
			return is_mobile.value;
		},
		sales_person() {
			if (this.doc.doctype == "Cart") {
				return this.doc.sales_person;
			} else {
				return (this.doc.sales_team || []).map(d => d.sales_person).join(", ");
			}
		},
	}
}
</script>
