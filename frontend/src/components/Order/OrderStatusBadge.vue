<template>
	<div
		class="rounded py-1 px-1.5 text-xs font-semibold"
		:class="status_color"
	>
		{{ status_label }}
	</div>
</template>

<script>
export default {
	name: "OrderStatusBadge",

	props: {
		doc: {
			type: Object,
			required: true,
		},
		loading: Boolean,
	},

	computed: {
		status_label() {
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
			if (this.status_label == "Draft") {
				return "bg-blue-200 text-blue-800";
			} else if (["Closed", "Delivered"].includes(this.status_label)) {
				return "bg-green-300 text-green-900";
			} else if (this.status_label == "To Deliver") {
				return "bg-orange-200 text-orange-700";
			} else {
				return "bg-gray-200 text-gray-800";
			}
		},
	}
}
</script>
