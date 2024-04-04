const viewheight = {
	screen_width: {},

	set_vh_height(element, vh, diff) {
		window.addEventListener('resize', () => {
			this.set_height.call(this, element, vh, diff);
		});
		window.addEventListener('orientationchange', () => {
			this.set_height.call(this, element, vh, diff);
		});

		this.set_height.call(this, element, vh, diff);
	},

	set_height(element, vh, diff) {
		if (window.innerWidth === this.screen_width[element]) {
			return;
		}

		let value = this.get_height(vh, diff);

		element.style['max-height'] = `${value}px`;

		this.screen_width[element] = window.innerWidth;
	},

	get_height(vh, diff) {
		vh = vh || 100;
		diff = diff || 0;
		return window.innerHeight * vh / 100 + diff;
	}
};

export default viewheight;
