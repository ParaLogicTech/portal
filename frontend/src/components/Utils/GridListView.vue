<template>
	<div class="@container overflow-y-scroll">
		<div v-if="loading && !has_data" class="h-full flex items-center justify-center text-gray-700 text-xl">
			<Spinner class="w-5 mr-2" />
			<span>{{ loading_message }}</span>
		</div>

		<div v-else-if="is_empty"
			class="h-full flex items-center justify-center text-gray-400 text-xl font-medium">
			<CircleSlash class="h-5 w-5 mr-2" />
			<div>{{ empty_message }}</div>
		</div>

		<div v-else
			:class="view_type_classes"
			class="gap-3 p-3"
		>
			<slot/>
		</div>
	</div>
</template>

<script>
import { CircleSlash } from "lucide-vue-next";

export default {
	name: "GridListView",

	components: {
		CircleSlash,
	},

	props: {
		has_data: Boolean,
		is_empty: Boolean,
		loading: Boolean,
		loading_message: {
			type: String,
			default: "Loading Data...",
		},
		empty_message: {
			type: String,
			default: "No Data Found",
		},
		view_type: {
			type: String,
			default: "Grid View",
		},
	},

	computed: {
		view_type_classes() {
			if (this.view_type == "List View") {
				return "grid grid-cols-1";
			} else {
				return "grid @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @7xl:grid-cols-5";
			}
		}
	}
};
</script>
