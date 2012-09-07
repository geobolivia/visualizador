var document, window;

(function () {
  "use strict";

  var createLayout, init;

  /**
   * Method: createLayout
   * Set the size of all <div> elements
   *
   * Returns:
   * nothing
   */
  createLayout = function () {
    document.getElementById('map').style.width = '100%';
    document.getElementById('map').style.height = '100%';
  };

  /**
   * Method: init
   * Principal function launched on "onLoad" event
   *
   * Returns:
   * nothing
   */
  init = function () {
    createLayout();
  };

  window.onload = init;

}());