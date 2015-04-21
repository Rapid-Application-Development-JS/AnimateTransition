document.addEventListener('DOMContentLoaded', function (event) {
	var button = document.querySelector('.animate-slide'),
		closeButton = document.querySelector('.animation-container__close'),
		radios = document.getElementsByName('animation'),
		animationTypeSpan = document.querySelectorAll('[data-animation-type]'),
		select = document.getElementById('animation-select'),
		mainBlock = document.querySelector('[data-block="out"]'),
		customOverlay = document.querySelector('.custom-overlay'),
		container = '.animation-container',
		popup = '[data-block="in"]',
		animation,
		showOverlay,
		radioButtonValue;

	function animateBlocks(event) {
		showOverlay = document.getElementById('is_overlay').checked;

		if (getComputedStyle(document.getElementById('animation-list')).display !== 'none') {
			animation = document.querySelector('input[type=radio]:checked').getAttribute('id');
		} else {
			if (getComputedStyle(document.getElementById('animation-select')).display !== 'none') {
				animation = select.options[select.selectedIndex].value;
			}
		}
		document.querySelector(popup).setAttribute('data-type', 'popup');
		AnimateTransition({
			container: container,
			blockIn: popup,
			animation: animation,
			onTransitionStart: function (blockIn, blockOut, container, event) {
				button.setAttribute('disabled', 'disabled');
				mainBlock.style.backgroundImage = 'none';

				if (showOverlay) {
					customOverlay.style.display = 'block';
				}
			},
			onTransitionEnd: function (blockIn, blockOut, container, event) {
			}
		});
	}

	button.addEventListener('click', animateBlocks);
	/**
	 * Closes popup
	 * @param {Event} event
	 */
	function closePopup(event) {
		animation =	animation.replace(/-in([^-in]*)$/, '-out$1');
		showOverlay = document.getElementById('is_overlay').checked;

		AnimateTransition({
			container: container,
			blockOut: popup,
			animation: animation,
			showOverlay: showOverlay,
			onTransitionEnd: function (blockIn, blockOut, container, event) {
				container.appendChild(blockOut);
				button.removeAttribute('disabled');
				blockOut.removeAttribute('data-type');
				mainBlock.style.backgroundImage = '';
				if (showOverlay) {
					customOverlay.style.display = 'none';
				}
			}
		});


	}

	closeButton.addEventListener('click', closePopup);
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