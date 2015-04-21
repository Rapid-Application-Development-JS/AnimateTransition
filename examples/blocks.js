document.addEventListener('DOMContentLoaded', function (event) {
	var button = document.querySelector('.animate-slide'),
		radios = document.getElementsByName('animation'),
		container = '.animation-container',
		blockIn = '[data-block="in"]',
		blockOut = '[data-block="out"]',
		select = document.getElementById('animation-select'),
		animationTypeSpan = document.querySelectorAll('[data-animation-type]'),
		radioButtonValue,
		animation;

	function animateBlocks(event) {

		if (getComputedStyle(document.getElementById('animation-list')).display !== 'none') {
			animation = document.querySelector('input[type=radio]:checked').getAttribute('id');
		} else {
			if (getComputedStyle(select).display !== 'none') {
				animation = select.options[select.selectedIndex].value;
			}
		}
		AnimateTransition({
			container: container,
			blockIn: blockIn,
			blockOut: blockOut,
			animation: animation,
			onTransitionStart: function (blockIn, blockOut, container, event) {
				button.setAttribute('disabled', 'disabled');
			},
			onTransitionEnd: function (blockIn, blockOut, container, event) {
				button.removeAttribute('disabled');
				if (blockOut) {
					blockIn.setAttribute('data-block', 'out');
					blockOut.setAttribute('data-block', 'in');
					container.appendChild(blockOut);
				}
			}
		});
	}

	button.addEventListener('click', animateBlocks);
	/**
	 * Changes animation type in code example on radio button click
	 * @param {Event} event
	 */
	function radioClick(event) {
		radioButtonValue = event.target.id;
		for (var index = 0; index < animationTypeSpan.length; index += 1) {
			animationTypeSpan[index].innerText = "'" + radioButtonValue + "'";
		}
	}

	for (var index = 0; index < radios.length; index += 1) {
		radios[index].addEventListener('click', radioClick);
	}
});