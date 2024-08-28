<template>
	<div class="flex justify-between items-center">
		<!-- Left side headings -->
		<div class="flex items-center">
			<FileText class="inline h-[18px]" stroke-width="1.8px"/>

			<h1 class="text-xl font-semibold ml-0.5">
				Sales Order
			</h1>

			<h2 class="text-lg font-normal ml-1.5">
				{{ name }}
			</h2>

			<OrderStatusBadge
				:doc="doc"
				:loading="loading"
				class="ml-2"
			/>
		</div>

		<!-- Right side buttons -->
		<div class="flex items-center gap-1">
			<!-- Loader -->
			<Spinner class="w-4" v-if="loading" />

			<!-- Tablet / Desktop Icons -->
			<div class="hidden sm:flex gap-1">
				<Button
					variant="ghost"
					theme="gray"
					size="sm"
					label="Reorder"
					title="Reorder"
					@click="show_reorder_dialog()"
				>
					<template #icon>
						<ListRestart class="w-[20px]" stroke-width="1.8px" />
					</template>
				</Button>

				<Button
					variant="ghost"
					theme="gray"
					size="sm"
					label="Print"
					title="Print"
					:link="print_link"
				>
					<template #icon>
						<Printer class="w-[18px]" stroke-width="1.9px" />
					</template>
				</Button>

				<Button
					variant="ghost"
					theme="gray"
					size="sm"
					label="Email"
					title="Email"
					@click="show_email_dialog()"
				>
					<template #icon>
						<Mail class="w-[18px]" stroke-width="1.9px" />
					</template>
				</Button>
			</div>

			<!-- Ellipsis menu -->
			<Popover>
				<template #target="{ togglePopover }">
					<Button
						variant="ghost"
						theme="gray"
						size="sm"
						class="w-[26px]"
						@click="togglePopover()"
					>
						<Ellipsis class="w-[18px]" stroke-width="2.5px"/>
					</Button>
				</template>
				<template #body="{ close }">
					<div class="bg-white border border-gray-300 rounded shadow-sm p-1 flex flex-col">
						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Reorder"
							class="!justify-start"
							@click="close(); show_reorder_dialog();"
						>
							<template #prefix>
								<ListRestart class="h-[15px] w-[15px]" stroke-width="2px" />
							</template>
						</Button>

						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Print"
							:link="print_link"
							@click="close()"
							class="!justify-start"
						>
							<template #prefix>
								<Printer class="w-[15px] h-[15px]" stroke-width="1.9px" />
							</template>
						</Button>

						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Email"
							class="!justify-start"
							@click="close(); show_email_dialog();"
						>
							<template #prefix>
								<Mail class="h-[15px] w-[15px]" stroke-width="1.9px" />
							</template>
						</Button>

						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Reload"
							class="!justify-start"
							@click="close(); $emit('reload');"
						>
							<template #prefix>
								<RefreshCw class="h-[15px] w-[15px]" stroke-width="1.9px" />
							</template>
						</Button>

						<Button
							variant="ghost"
							theme="gray"
							size="sm"
							label="Open in Desk View"
							:link="desk_link"
							@click="close()"
							class="!justify-start"
							v-if="settings.is_system_user"
						>
							<template #prefix>
								<ExternalLink class="h-[15px] w-[15px]" />
							</template>
						</Button>
					</div>
				</template>
			</Popover>
		</div>

		<EmailDialog
			v-model="email_dialog"
			:doc="doc"
			:email_template="settings.sales_order_email_template"
			:default_recipient="doc.contact_email"
		/>

		<Dialog
			v-model="reorder_dialog"
			:options="{
				title: 'Confirm Reorder',
				message: 'Are you sure you want to reorder all items from this order?',
				size: 'lg',
				actions: [
					{
						label: 'Confirm Reorder',
						variant: 'solid',
						theme: 'blue',
						onClick: () => this.reorder_items(),
					},
				],
			}"
		/>
	</div>
</template>

<script>
import {Ellipsis, FileText, ExternalLink, Printer, RefreshCw, Mail, ListRestart} from "lucide-vue-next";
import OrderStatusBadge from "@/components/Order/OrderStatusBadge.vue";
import {Button, Popover} from "frappe-ui";
import {settings} from "@/data/settings";
import EmailDialog from "@/components/Utils/EmailDialog.vue";
import {alert_select_customer, cart} from "@/data/cart";

export default {
	name: "OrderHeader",

	components: {
		RefreshCw,
		ExternalLink,
		Ellipsis,
		Button,
		OrderStatusBadge,
		FileText,
		Popover,
		Printer,
		Mail,
		EmailDialog,
		ListRestart,
	},

	props: {
		name: {
			type: String,
			required: true,
		},
		doc: {
			type: Object,
			required: true,
		},
		loading: Boolean,
	},

	data() {
		return {
			email_dialog: false,
			reorder_dialog: false,
			settings: settings,
		}
	},

	methods: {
		async reorder_items() {
			await cart.reorder_items(this.name);
			await this.$router.push({name: "CartView"});
			this.reorder_dialog = false;
		},

		show_email_dialog() {
			this.email_dialog = true;
		},
		show_reorder_dialog() {
			if (!cart.customer_or_cart_selected()) {
				alert_select_customer();
				return;
			}
			this.reorder_dialog = true;
		},
	},

	computed: {
		desk_link() {
			return `/app/sales-order/${encodeURIComponent(this.name)}`;
		},

		print_link() {
			return `/api/method/frappe.utils.print_format.download_pdf?doctype=Sales Order&name=${encodeURIComponent(this.name)}`;
		},
	},
}
</script>
