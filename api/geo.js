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

var document, window;

(function () {
  "use strict";

  var createLayout, init;

  /**
   * A Configuration object
   * @constructor
   */
  function Configuration() {
    this.width = '400px';
    this.height = '400px';
  }

  /**
   * Set the size of all <div> elements
   * @param {Configuration} conf Configuration of the viewer
   */
  createLayout = function (conf) {
    var container, map;

    container = document.getElementById('container');
    map = document.getElementById('map');

    container.style.width = conf.width;
    container.style.height = conf.height;

    map.style.width = '100%';
    map.style.height = '100%';
  };

  /**
   * Principal function launched on "onLoad" event
   */
  init = function () {
    var conf = new Configuration();
    createLayout(conf);
  };

  window.onload = init;

}());