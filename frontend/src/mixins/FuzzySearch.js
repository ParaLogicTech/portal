import Fuse from 'fuse.js'

const FuzzySearch = {
	data() {
		return {
			filters: {
				txt: null,
			},
			// To override
			fuzzy_search_keys: ['name'],
		}
	},

	computed: {
		fuzzy_matches() {
			let out = {};
			if (this.fuzzy_match_result) {
				for (let d of this.fuzzy_match_result) {
					out[d.item.name] = d.matches
				}
			}
			return out;
		},

		fuzzy_filtered_items() {
			if (this.fuzzy_match_result) {
				return this.fuzzy_match_result.map(d => d.item);
			} else {
				return this.list_data;
			}
		},

		fuzzy_match_result() {
			if (this.clean_txt) {
				return this.fuzzy_search(this.clean_txt);
			} else {
				return null;
			}
		},

		clean_txt() {
			let txt = this.filters.txt || "";
			return txt.toString().trim();
		},

		filters_applied() {
			let applied = false;
			for (let v of Object.values(this.filters)) {
				if (typeof v == "string") {
					v = v.trim();
				}
				if (v) {
					applied = true;
					break
				}
			}
			return applied;
		},
	},

	methods: {
		fuzzy_search(txt) {
			let items = this.list_data;
			let fuse = new Fuse(items, {
				keys: this.fuzzy_search_keys,
				threshold: 0.4,
				includeMatches: true,
				minMatchCharLength: 2,
			});
			return fuse.search(txt);
		},
	},
}

export default FuzzySearch;
