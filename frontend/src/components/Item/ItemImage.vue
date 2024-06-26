<template>
	<div class="bg-white" :class="rounded">
		<img
			v-if="item.image"
			class="w-auto h-full mx-auto object-cover"
			:class="rounded"
			:src="item.image"
			:alt="item.item_name || item.name"
			loading="lazy"
		/>
		<div
			v-else
			class="w-full h-full bg-gray-50 flex items-center justify-center p-5 text-gray-300 text-center text-ellipsis overflow-hidden"
			:class="[rounded, font ? font : 'text-6xl']"
		>
			{{ item.name }}
		</div>

		<!-- Image Full View -->
		<Expand
			v-if="item.image && full_view_enable"
			class="absolute top-[7px] left-[7px] w-[18px] h-[18px] hover:scale-105 transition-transform ease-linear duration-200 text-gray-700"
			@click.stop="this.modal=true"
		/>

		<Teleport to="#modals">
			<vue-easy-lightbox
				:visible="this.modal"
				:imgs="[this.item.image]"
				:zoom-disabled="true"
				:move-disabled="true"
				:dblclick-disabled="true"
				@hide="this.modal=false"
			>
				<template v-slot:toolbar=""></template>
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
		item: Object,
		rounded: String,
		font: String,
		full_view_enable: Boolean
	},
}
</script>

<style>
	.vel-img-wrapper img {
		cursor: default;
	}
</style>