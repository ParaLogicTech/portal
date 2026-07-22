<template>
	<div class="bg-white relative" :class="rounded">
		<!-- New Ribbon -->
		<div
			v-if="is_new"
			class="ribbon-top-left"
		>
			<div class="ribbon-text">NEW</div>
		</div>

		<!-- Full View Button Icon -->
		<button
			v-if="(image || thumbnail) && enable_full_view"
			class="absolute top-[6px] left-[6px] hover:scale-110 transition-transform ease-out duration-200"
			@click.stop="this.modal = true"
		>
			<Expand
				class="text-white expand-icon-shadow w-[18px] h-[18px]"
				stroke-width="2px"
			/>
		</button>

		<!-- Image -->
		<img
			v-if="thumbnail || image"
			class="w-full h-full mx-auto"
			:class="[rounded, object_fit]"
			:src="thumbnail || image"
			:alt="item_name || item_code"
			loading="lazy"
		/>
		<div
			v-else
			class="w-full h-full bg-gray-50 flex items-center justify-center p-5 text-gray-300 text-center text-ellipsis overflow-hidden"
			:class="[rounded, font ? font : 'text-6xl']"
		>
			{{ item_code }}
		</div>

		<!-- Full View Modal -->
		<Teleport to="#modals" v-if="enable_full_view">
			<vue-easy-lightbox
				:visible="this.modal"
				:imgs="[image || thumbnail]"
				:zoom-disabled="true"
				:move-disabled="true"
				:dblclick-disabled="true"
				@hide="this.modal = false"
			>
				<template #toolbar />
			</vue-easy-lightbox>
		</Teleport>
	</div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';
import { Expand } from 'lucide-vue-next';

export default {
	name: "ItemImage",

	components: {
		VueEasyLightbox,
		Expand
	},

	data() {
		return {
			modal: false,
		}
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
		item_row: {
			type: Object,
			required: false,
		},
		rounded: String,
		font: String,
		object_fit: {
			type: String,
			default: "object-cover"
		},
		enable_full_view: Boolean,
		is_new: [Boolean, Number],
	},

	computed: {
		thumbnail() {
			return this.item?.thumbnail || this.item?.image || this.item_row?.thumbnail || this.item_row?.image;
		},

		image() {
			return this.item?.image || this.item_row?.image;
		},

		item_code() {
			return this.item?.name || this.item_row?.item_code;
		},

		item_name() {
			return this.item?.item_name || this.item_row?.item_name;
		},
	},
}
</script>

<style>
	.vel-img-wrapper img {
		cursor: default;
	}
	.expand-icon-shadow {
		filter: drop-shadow(0 0 1px #000000);
	}
</style>
