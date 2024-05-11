<template>
	<div class="flex justify-between items-center">
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

		<div class="flex items-center gap-1.5">
			<Spinner class="w-4" v-if="loading" />

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
							label="Open in Desk View"
							:link="desk_link"
							@click="close()"
							class="!justify-start"
						>
							<template #prefix>
								<ExternalLink class="h-[15px] w-[15px]" />
							</template>
						</Button>
					</div>
				</template>
			</Popover>
		</div>
	</div>
</template>

<script>
import {Ellipsis, FileText, ExternalLink, Printer} from "lucide-vue-next";
import OrderStatusBadge from "@/components/Order/OrderStatusBadge.vue";
import {Button, Popover} from "frappe-ui";

export default {
	name: "OrderHeader",

	components: {ExternalLink, Ellipsis, Button, OrderStatusBadge, FileText, Popover, Printer},

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
