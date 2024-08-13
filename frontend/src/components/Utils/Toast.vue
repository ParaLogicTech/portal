<template>
	<div
		class="min-w-[20rem] max-w-[40rem] rounded border p-3 shadow-xl transition duration-200 ease-in-out"
		:class="backgroundClass"
		:style="{opacity: opacity}"
	>
		<div class="flex items-start">
			<div v-if="iconName" class="mr-2 grid h-5 w-5 place-items-center">
				<FeatherIcon :name="iconName" :class="['h-5 w-5', textClass, iconClasses]" />
			</div>
			<div>
				<slot>
					<p
						v-if="title"
						class="text-base font-semibold"
						:class="textClass"
					>
						{{ title }}
					</p>
					<p
						v-if="displayMessage"
						class="text-base font-normal"
						:class="textClass"
						v-html="displayMessage"
					/>
				</slot>
			</div>
			<div class="ml-auto pl-2 pointer-events-auto">
				<slot name="actions">
					<button
						class="grid h-5 w-5 place-items-center rounded hover:bg-gray-100"
						@click="close"
					>
						<FeatherIcon name="x" class="h-4 w-4 text-gray-700" />
					</button>
				</slot>
			</div>
		</div>
	</div>
</template>
<script>

import {nextTick} from "vue";

export default {
	name: 'Toast',

	data() {
		return {
			opacity: 1,
		}
	},

	props: {
		variant: {
			type: String,
			default: 'info',
		},
		icon: {
			type: String,
		},
		iconClasses: {
			type: String,
		},
		title: {
			type: String,
		},
		message: {
			type: String,
		},
		timeout: {
			type: Number,
			default: 5,
		},
		fade: {
			type: Boolean,
			default: false,
		}
	},

	methods: {
		close() {
			if (this.fade) {
				this.opacity = 0;
				nextTick(() => {
					setTimeout(() => {
						this?.$emit('close');
					}, 300);
				});
			} else {
				this.$emit('close')
			}
		}
	},

	computed: {
		backgroundClass() {
			return {
				'bg-red-100 border-red-400': this.variant === 'error',
				'bg-green-100 border-green-400': this.variant === 'success',
				'bg-yellow-100 border-yellow-400': this.variant === 'warning',
				'bg-blue-100 border-blue-400': this.variant === 'info',
			}
		},

		textClass() {
			return {
				'text-red-800': this.variant === 'error',
				'text-green-800': this.variant === 'success',
				'text-yellow-800': this.variant === 'warning',
				'text-blue-800': this.variant === 'info',
			}
		},

		iconName() {
			if (this.icon || this.icon === false) {
				return this.icon;
			}
			return {
				'error': 'alert-circle',
				'success': 'check',
				'warning': 'alert-triangle',
				'info': 'info',
			}[this.variant]
		},

		displayMessage() {
			if (this.message instanceof Error) {
				return this.message.messages?.[0] || this.message.message
			}
			return this.message || '';
		}
	},

	emits: ['close'],

	beforeMount() {
		if (this.fade) {
			this.opacity = 0;
		}
	},

	mounted() {
		if (this.fade) {
			nextTick(() => {
				setTimeout(() => {
					this.opacity = 1;
				}, 100);
			});
		}

		if (this.timeout > 0) {
			setTimeout(() => {
				this.close();
			}, this.timeout * 1000)
		}
	},
}
</script>
