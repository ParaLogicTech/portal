<template>
	<span>
		<span
			v-for="p in parts"
			:class="p.is_match ? 'bg-yellow-100 rounded-sm' : ''"
		>
			{{ p.text }}
		</span>
	</span>
</template>

<script>
export default {
	name: "HighlightedMatchText",

	props: {
		text: String,
		matches: Object,
	},

	computed: {
		parts() {
			let text = this.text || "";
			let matches = this.matches || {};

			if (!matches.indices || !matches.indices.length) {
				return [{text: text, is_match: false}];
			}

			let parts = [];
			let text_idx = 0;
			for (let i of matches.indices) {
				let start = i[0];
				let end = i[1];

				if (text_idx < start) {
					let part = text.substring(text_idx, start);
					parts.push({text: part, is_match: false});
					text_idx = start;
				}

				let part = text.substring(start, end+1);
				parts.push({text: part, is_match: true});
				text_idx = end+1;
			}

			if (text_idx < text.length) {
				let part = text.substring(text_idx);
				parts.push({text: part, is_match: false});
			}

			return parts;
		}
	}
}
</script>
