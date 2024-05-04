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
	</div>
</template>

<script>
import {FileText} from "lucide-vue-next";
import OrderStatusBadge from "@/components/Order/OrderStatusBadge.vue";

export default {
	name: "OrderHeader",

	components: {OrderStatusBadge, FileText},

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
}
</script>
