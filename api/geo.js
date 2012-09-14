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
    this.wmcUrl = '';
    this.proxy = "/cgi-bin/proxy.cgi?url=";
  }

  /**
   * Parse and validate the URL parameters
   */
  Configuration.prototype.getURLParameters = function () {
    this.wmcUrl = getURLParameter('wmc') || this.wmcURL;
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
   * Load the context from the  WMC specified in the URL
   * A proxy may be necessary for that function
   * http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#HowdoIsetupaProxyHost
   * @param {Configuration} conf Configuration of the viewer
   */
  function loadWMC(conf) {
    var request;

    if (!conf.wmcUrl) {
      return;
    }

    OpenLayers.ProxyHost = conf.proxy;
    request = OpenLayers.Request.GET({
      url: conf.wmcUrl,
      callback: function (request) {
        var parser, jsonFormat, mapOptions, bounds, map;

        if (request.status < 200 || request.status >= 300) {
          // Error
          alert("Error de status " + request.status);
          return;
        }
        if (!request.responseXML) {
          // Error
          alert("Error de responseXML");
          return;
        }
        parser = new OpenLayers.Format.WMC();
        parser.read(request.responseXML, {map: 'map'});
      }
    });
  }

  /**
   * Create an OpenLayers map in the #map <div>
   */
  function createMap(conf) {
    loadWMC(conf);
  }

  /**
   * Principal function launched on "onLoad" event
   */
  init = function () {
    var conf;
    conf = new Configuration();
    conf.getURLParameters();
    createLayout(conf);
    createMap(conf);
  };

  window.onload = init;

}());