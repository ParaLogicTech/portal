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

		<div v-else>
			<!-- Grouped View -->
			<GridListGroup
				v-if="show_groups && groups_with_items?.length"
				v-for="group in groups_with_items"
				:key="group"
				:group="group"
				:group_field="group_field"
				:view_type="view_type"
				:page_length="group_page_length"
				:items="get_group_items(group)"
			>
				<template #default="scope">
					<slot v-bind="scope" />
				</template>

				<template #group="scope">
					<slot name="group" v-bind="scope">
						{{ scope.group || "Ungrouped" }}
					</slot>
				</template>

				<template #show_more="scope">
					<slot name="show_more" v-bind="scope" />
				</template>
			</GridListGroup>

			<!-- Ungrouped View -->
			<GridListGroup
				v-else
				:group="null"
				:items="items"
				:view_type="view_type"
				:page_length="group_page_length"
				v-slot="{item}"
			>
				<slot :item="item" />
			</GridListGroup>
		</div>
	</div>
</template>

<script>
import { CircleSlash } from "lucide-vue-next";
import GridListGroup from "@/components/GridList/GridListGroup.vue";

export default {
	name: "GridListView",

	components: {
		GridListGroup,
		CircleSlash,
	},

	props: {
		items: {
			type: Array,
			required: true,
		},
		has_data: {
			type: Boolean,
			default: () => Boolean(items && items.length),
		},
		loading: {
			type: Boolean,
			default: false,
		},
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
		show_groups: {
			type: Boolean,
			default: false,
		},
		groups: Array,
		group_field: String,
		group_page_length: Number,
	},

	methods: {
		get_group_items(group) {
			const group_items_obj = this.group_items_map || {};
			return group_items_obj[group] || [];
		}
	},

	computed: {
		is_empty() {
			return !this.items?.length;
		},

		group_items_map() {
			let group_map = {};
			for (let d of this.items || []) {
				let group = d[this.group_field] || "";
				if (!group_map[group]) {
					group_map[group] = [];
				}

				group_map[group].push(d);
			}

			return group_map;
		},

		groups_with_items() {
			return (this.groups || []).filter(g => Boolean(this.group_items_map[g]?.length));
		},
	}
};
</script>
