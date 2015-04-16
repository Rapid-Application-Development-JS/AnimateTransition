##animate_transition.js

Library for transition animations between pages (blocks) in the application.

###Methods

#### pagesTransition

	pagesTransition(options)
	
Takes the object **options** as the parameter. The object has the following properties:

* **container** - container where the animation will take  place. If the property is not defined, by default will be used **document.body** 
* **pageIn** - page, to which the transition is carried out. If it is not defined, by **pageOut** the page with the selected animation will  disappear from the screen.
* **pageOut** - page, from which the transition is carried out. If it is not defined, by **pageIn** the page with the selected animation will appear.
* **animation** - custom animation name. Currently the following animations are supported by default:
	- `slide` (`slide-in`, `slide-out`)
	- `fade` (`fade-in`, `fade-out`)
	- `cover` (`cover-in`, `cover-out`)
	- `cover-right` (`cover-right-in`, `cover-right-out`)
	- `cover-left` (`cover-left-in`, `cover-left-out`)
	- `cover-double` (`cover-double-in`, `cover-double-out`)
	- `revolution` (`revolution-in`, `revolution-out`)
	- `bounce` (`bounce-in`, `bounce-out`)
	- `outside` (`outside-in`, `outside-out`)
	- `popup-scale` (`popup-scale-in`, `popup-scale-out`)
	- `popup-fade` (`popup-fade-in`, `popup-fade-out`)
	- `popup-drop` (`popup-drop-in`, `popup-drop-out`)

>Take notice that the last 3 animations are used for showing popups.  

* `beforeTransition(pageIn, pageOut, container)` - function that will be performed before the transition; if it is set to **false**, the animation will not be performed.
* `onTransitionStart(pageIn, pageOut, container, e)` - function that will be performed at the start of the transition, where **е** is the event object.
* `onTransitionEnd(pageIn, pageOut, container, e)` - function that will be performed at the end of the transition, where **е** is the event object.

Properties **animation**, **beforeTransition**, **onTransitionStart** and **onTransitionEnd** are optional.

**example**
```javascript
animateTransition({
   container: this.container,
   pageIn: newElement,
   animation: 'slide-in'
});
```