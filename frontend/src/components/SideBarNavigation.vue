<template>
	<aside class="p-2 controls-bg overflow-x-scroll md:overflow-x-hidden">
		<nav class="sidebar-nav">
			<ul class="flex justify-around md:block">
				<router-link :to="{ name: 'ItemListView' }">
					<li>
						<PackageSearch class="icon" stroke-width="1.8px"/>
						<h4>Items</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'ItemGroupListView' }">
					<li>
						<Boxes class="icon" stroke-width="1.5px"/>
						<h4>Item Groups</h4>
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
						<h4>Order History</h4>
					</li>
				</router-link>
				<router-link :to="{ name: 'CartView' }">
					<li>
						<ShoppingBag class="icon" stroke-width="1.8px"/>
						<h4>Order Cart</h4>
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
		li {
			@apply p-2 mb-2 text-gray-600 text-center rounded-sm;
			@apply outline outline-1 outline-transparent;

			transition-property: color, background-color, border-color, outline-color, fill, stroke, box-shadow;
			@apply duration-200 ease-in-out;

			list-style: none;

			.icon {
				margin: auto;
				width: 25px;
				height: 25px;
			}

			h4 {
				@apply text-xs font-medium mt-1;
			}
		}

		a:hover:not(.router-link-active) li {
			@apply text-gray-800 shadow outline-gray-300;
		}

		.router-link-active li {
			@apply text-violet-700 shadow-md outline-gray-500;
		}
	}

	@media screen and (max-width: 768px){
		.sidebar-nav {
			a {
				@apply px-1.5
			}

			li {
				@apply p-1.5 w-[95px] mb-0;
			}
		}
	}
</style>
