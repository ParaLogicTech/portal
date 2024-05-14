<template>
	<aside class="controls-bg small-scroll-bar overflow-auto">
		<nav class="sidebar-nav" :class="{'horizontal': horizontal}">
			<ul class="flex flex-nowrap">
				<router-link :to="{ name: 'ItemListView' }">
					<li>
						<PackageSearch class="icon" stroke-width="1.8px"/>
						<h4>Items</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'ItemGroupListView' }">
					<li>
						<Boxes class="icon" stroke-width="1.5px"/>
						<h4>{{ horizontal ? "Groups": "Item Groups" }}</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'BrandListView' }">
					<li>
						<Award class="icon" stroke-width="1.8px"/>
						<h4>Brands</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'OrderListView' }">
					<li>
						<History class="icon" stroke-width="1.8px" />
						<h4>{{ horizontal ? "History" : "Order History"}}</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'CartView' }">
					<li>
						<ShoppingBag class="icon" stroke-width="1.8px"/>
						<h4>{{ horizontal ? "Cart" : "Order Cart" }}</h4>
					</li>
				</router-link>
			</ul>
		</nav>
	</aside>
</template>

<script>
import {PackageSearch, ShoppingBag, Boxes, Award, History} from 'lucide-vue-next';

export default {
	name: "SideBarNavigation",

	props: {
		horizontal: Boolean,
	},

	components: {
		ShoppingBag,
		PackageSearch,
		Boxes,
		Award,
		History,
	}
}
</script>

<style lang="scss">
	.sidebar-nav {
		@apply p-2;

		ul {
			@apply flex flex-col flex-nowrap gap-2 items-center;
		}

		li {
			@apply flex flex-col items-center text-center;
			@apply p-2 text-gray-600 rounded-sm;
			@apply outline outline-1 outline-transparent;

			transition-property: color, background-color, border-color, outline-color, fill, stroke, box-shadow;
			@apply duration-200 ease-in-out;

			list-style: none;
		}

		h4 {
			@apply text-xs font-medium mt-1;
		}

		.icon {
			width: 25px;
			height: 25px;
		}

		a:hover:not(.router-link-active) li {
			@apply text-gray-800 shadow outline-gray-300;
		}

		.router-link-active li {
			@apply text-violet-700 shadow-md outline-gray-500;
		}

		&.horizontal {
			@apply h-full p-1.5;

			ul {
				@apply flex-row justify-evenly h-full;
			}

			a {
				@apply h-full;
				min-width: 50px;
			}

			li {
				@apply py-1.5 h-full;
			}

			h4 {
				@apply text-2xs;
			}

			.icon {
				@apply flex-none;
				width: 20px;
				height: 20px;
			}
		}
	}
</style>
