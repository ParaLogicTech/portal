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

			<div
				class="rounded py-1 px-1.5 text-xs font-semibold ml-2"
				:class="status_color"
			>
				{{ status }}
			</div>
		</div>
	</div>
</template>

<script>
import {FileText} from "lucide-vue-next";

export default {
	name: "OrderHeader",

	components: {FileText},

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
		status() {
			if (this.loading) {
				return "Loading";
			} else {
				if (this.doc.docstatus == 0) {
					return "Draft";
				} else if (this.doc.docstatus == 2) {
					return "Cancelled";
				} else if (this.doc.status == "Closed") {
					return "Closed";
				} else if (this.doc.delivery_status == "Delivered") {
					return "Delivered";
				} else {
					return "To Deliver";
				}
			}
		},

		status_color() {
			if (this.status == "Draft") {
				return "bg-blue-200 text-blue-800";
			} else if (["Closed", "Delivered"].includes(this.status)) {
				return "bg-green-300 text-green-900";
			} else if (this.status == "To Deliver") {
				return "bg-orange-200 text-orange-700";
			} else {
				return "bg-gray-200 text-gray-800";
			}
		},
	}
}
</script>
