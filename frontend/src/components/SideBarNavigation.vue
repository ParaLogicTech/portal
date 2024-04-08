<template>
	<aside class="p-2">
		<nav>
			<ul>
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
				<li>
					<ShoppingBag class="icon" stroke-width="1.8px"/>
					<h4>Order Cart</h4>
				</li>
			</ul>
		</nav>
	</aside>
</template>

<script>
import {PackageSearch, ShoppingBag, Boxes} from 'lucide-vue-next';

export default {
	name: "SideBarNavigation",

	components: {
		ShoppingBag,
		PackageSearch,
		Boxes,
	}
}
</script>

<style lang="scss" scoped>
	li {
		@apply p-2 mb-2 text-gray-500 text-center cursor-pointer;
		list-style: none;

		.icon {
			margin: auto;
			svg {
				width: 23px;
			}
		}

		h4 {
			@apply text-xs font-medium mt-1;
		}
	}

	.router-link-exact-active {
		li {
			@apply text-gray-900 rounded shadow outline outline-1 outline-gray-500;
		}
	}
</style>