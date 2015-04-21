(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return (root.AnimateTransition = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = (root.AnimateTransition = factory());
  } else {
    root.AnimateTransition = factory();
  }
}(this, function () {
  'use strict';
  var animateTransition;

  /**
   * Animate Transition
   */
  function AnimateTransition() {
    var prefixes = ['webkit', 'moz', 'MS', 'o', ''], overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    // Utils
    function showOverlay() {
      document.body.appendChild(overlay);
    }

    function hideOverlay() {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
    }

    function getElement(selector) {
      if (!selector) {
        return null;
      }
      return selector.tagName ? selector : document.querySelector(selector);
    }

    function addPrefixedEvent(element, eventName, callback) {
      for (var i = 0; i < prefixes.length; i++) {
        if (!prefixes[i]) {
          eventName = eventName.toLowerCase();
        }
        element.addEventListener(prefixes[i] + eventName, callback, false);
      }
    }

    function removePrefixedEvent(element, eventName, callback) {
      for (var i = 0; i < prefixes.length; i++) {
        if (!prefixes[i]) {
          eventName = eventName.toLowerCase();
        }
        element.removeEventListener(prefixes[i] + eventName, callback, false);
      }
    }

    // @todo replaced 'cname' by 'className'
    function hasClass(obj, className) {
      return (obj.className ? obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)')) : false);
    }

    // @todo replaced 'cname' by 'className'
    function addClass(obj, className) {
      if (obj && !hasClass(obj, className)) {
        obj.className += " " + className;
      }
    }

    // @todo replaced 'cname' by 'className'
    function removeClass(obj, className) {
      if (obj && hasClass(obj, className)) {
        obj.className = obj.className.replace(new RegExp('(\\s|^)' + className + '(?=\\s|$)'), '');
      }
    }

    function getFakeEventObj(name) {
      return {
        type: 'fake',
        animationName: name || 'none',
        stopPropagation: function () {
        }
      }
    }

    // @todo replaced 'pages' by 'blocks'
    // @todo we can use it no only for pages
    function blocksTransition(options) {
      var container,
        blockIn,
        blockOut,
        animationName,
        blockInClassName,
        blockOutClassName,
        transitionTypeName,
        beforeTransition,
        onTransitionStart,
        onTransitionEnd,
        timer,
        timeOut = 3500;
      // initialize options
      options = options || {};
      container = getElement(options.container) || document.body;
      blockIn = getElement(options.blockIn);
      blockOut = getElement(options.blockOut);
      animationName = options.animation || 'none';
      beforeTransition = options.beforeTransition || function () {
      };
      onTransitionStart = options.onTransitionStart || function () {
      };
      onTransitionEnd = options.onTransitionEnd || function () {
      };
      blockInClassName = animationName + '-transition-view-to-show';
      blockOutClassName = animationName + '-transition-view-to-hide';
      transitionTypeName = 'transition-' + animationName;
      // @todo added verification of the absence of all blocks
      if (!blockIn && !blockOut) {
        console.log('Blocks are not defined');
        return;
      }
      if (blockIn === blockOut) {
        // @todo added error log
        console.log('You are trying to animate same element');
        return;
      }
      // Stop animation if any still in animation process
      if ((blockIn && blockIn.busy) || (blockOut && blockOut.busy)) {
        console.log('You try apply new animation cannot be applied to the same element until previous animation is not finished.');
        // @todo added return; need to check
        return;
      }
      // You can use beforeTransition callback to define extra logic.
      // If result of the callback will be false then transition will be aborted.
      if (beforeTransition && beforeTransition(blockIn, blockOut, container) === false) {
        // @todo added error log
        console.log('Result of the beforeTransition callback is false');
        return;
      }
      // Init onAnimationStart event handler
      function onAnimationStart(e) {
        if (e.animationName !== animationName) {
          return;
        }
        onTransitionStart(blockIn, blockOut, container, e);
        removePrefixedEvent(container, 'AnimationStart', onAnimationStart);
      }

      addPrefixedEvent(container, 'AnimationStart', onAnimationStart);
      // Init onAnimationEnd event handler
      function onAnimationEnd(e) {
        if (e.animationName !== animationName) {
          return;
        }
        e.stopPropagation();
        if (blockIn) {
          blockIn.busy = false;
        }
        if (blockOut) {
          blockOut.busy = false;
          if (blockOut.parentNode === container) {
            container.removeChild(blockOut);
          }
          // @todo is needed to add else or wrap in try/catch?
          removeClass(blockOut, blockOutClassName);
        }
        onTransitionEnd(blockIn, blockOut, container, e);
        removeClass(container, transitionTypeName);
        removeClass(blockIn, blockInClassName);
        if (timer) {
          clearTimeout(timer);
        }

        hideOverlay();
        removePrefixedEvent(container, 'AnimationEnd', onAnimationEnd);
      }

      addPrefixedEvent(container, 'AnimationEnd', onAnimationEnd);
      // If animation was not set - show new block without transition
      if (animationName === 'none') {
        if (blockIn) {
          container.appendChild(blockIn);
        }
        onTransitionStart(blockIn, blockOut, container, getFakeEventObj());
        if (blockOut) {
          try {
            container.removeChild(blockOut);
          } catch (err) {
            console.log('You try apply new animation without subject');
          }
          onTransitionEnd(blockIn, blockOut, container, getFakeEventObj());
        } else {
          onTransitionEnd(blockIn, blockOut, container, getFakeEventObj());
        }
        return;
      }
      // Init transition:
      // ----------------------
      // Prepare for new transition.
      if (blockIn) {
        blockIn.busy = true;
        addClass(blockIn, blockInClassName);
        container.appendChild(blockIn);
        // we don't need blockOut.offsetHeight; because we add it with css class
      }
      if (blockOut) {
        blockOut.busy = true;
        addClass(blockOut, blockOutClassName);
        // @todo replaced comment
        // force WebKit to redraw/repaint without propagation
        blockOut.offsetHeight;
      }
      // Enable overlay layer to protect from accidental clicks until animation ends
      showOverlay();
      // Set timeout for case if onAnimationEnd event will not occur
      timer = window.setTimeout(function () {
        onAnimationEnd(getFakeEventObj(animationName));
      }, timeOut);
      // Add predefined CSS class to start CSS animation
      addClass(container, transitionTypeName);
    }

    // @todo replaced 'pages' by 'blocks'
    return blocksTransition;
  }

  animateTransition = new AnimateTransition();
  animateTransition.Constructor = AnimateTransition;
  return animateTransition;
}));