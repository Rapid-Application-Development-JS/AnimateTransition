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

    function AnimateTransition() {
    var prefixes = ['webkit', 'moz', 'MS', 'o', ''], overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
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
    function hasClass(obj, className) {
      return (obj.className ? obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)')) : false);
    }
    function addClass(obj, className) {
      if (obj && !hasClass(obj, className)) {
        obj.className += " " + className;
      }
    }
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
      if (!blockIn && !blockOut) {
        console.log('Blocks are not defined');
        return;
      }
      if (blockIn === blockOut) {
        console.log('You are trying to animate same element');
        return;
      }
      if ((blockIn && blockIn.busy) || (blockOut && blockOut.busy)) {
        console.log('You try apply new animation cannot be applied to the same element until previous animation is not finished.');
        return;
      }
      if (beforeTransition && beforeTransition(blockIn, blockOut, container) === false) {
        console.log('Result of the beforeTransition callback is false');
        return;
      }
      function onAnimationStart(e) {
        if (e.animationName !== animationName) {
          return;
        }
        onTransitionStart(blockIn, blockOut, container, e);
        removePrefixedEvent(container, 'AnimationStart', onAnimationStart);
      }

      addPrefixedEvent(container, 'AnimationStart', onAnimationStart);
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
      if (blockIn) {
        blockIn.busy = true;
        addClass(blockIn, blockInClassName);
        container.appendChild(blockIn);
      }
      if (blockOut) {
        blockOut.busy = true;
        addClass(blockOut, blockOutClassName);
        blockOut.offsetHeight;
      }
      showOverlay();
      timer = window.setTimeout(function () {
        onAnimationEnd(getFakeEventObj(animationName));
      }, timeOut);
      addClass(container, transitionTypeName);
    }
    return blocksTransition;
  }

  animateTransition = new AnimateTransition();
  animateTransition.Constructor = AnimateTransition;
  return animateTransition;
}));