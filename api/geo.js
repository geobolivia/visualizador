/**
 * Copyright (C) GeoBolivia
 *
 * This file is part of GeoBolivia API
 *
 * GeoBolivia API is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GeoBolivia API.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @fileoverview Create a simple map viewer from a WMC file
 * @author cperez@geo.gob.bo (Ariel Perez)
 * @author fvelasquez@geo.gob.bo (Rodolfo Velasquez)
 * @author slesage@geo.gob.bo (Sylvain Lesage)
 */

/**
 * @requires OpenLayers/Map.js
 */

/*jslint browser: true*/
/*global OpenLayers*/

(function () {
  "use strict";

  var init;

  /*
   * Create size in pixel for CSS
   * ex: createSizePx('200') -> '200px'
   * @param {string} size size in pixels
   * @return {string} size in the following format '200px'
   *                  if error: null
   */
  function createSizePx(size) {
    var intSize = parseInt(size, 10);
    return isNaN(intSize) ? null : intSize.toString() + 'px';
  }

  /*
   * Parse the page URL to find a parameter value
   * @param {string} name name of the parameter
   * @return {string} value of the parameter
   *                  if error: null
   */
  function getURLParameter(name) {
    var regexp, regexpRes, firstMatch, value;
    regexp = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
    regexpRes = regexp.exec(location.search);
    firstMatch = (regexpRes || ["", ""])[1];
    value = decodeURIComponent(firstMatch.replace(/\+/g, '%20'));
    return value || null;
  }

  /**
   * A Configuration object
   * @constructor
   */
  function Configuration() {
    this.width = '400px';
    this.height = '400px';
  }

  /**
   * Parse and validate the URL parameters
   */
  Configuration.prototype.getURLParameters = function () {
    this.width = createSizePx(getURLParameter('width')) || this.width;
    this.height = createSizePx(getURLParameter('height')) || this.height;
  };

  /**
   * Set the size of all <div> elements
   * @param {Configuration} conf Configuration of the viewer
   */
  function createLayout(conf) {
    var container, map;

    container = document.getElementById('container');
    map = document.getElementById('map');

    container.style.width = '100%';
    container.style.height = '100%';

    map.style.width = '100%';
    map.style.height = '100%';
  }

  /**
   * Create an OpenLayers map in the #map <div>
   */
  function createMap() {
    var map, options;
    options = {
      theme: null
    };
    map = new OpenLayers.Map('map', options);
  }

  /**
   * Principal function launched on "onLoad" event
   */
  init = function () {
    var conf = new Configuration();
    conf.getURLParameters();
    createLayout(conf);
    createMap();
  };

  window.onload = init;

}());