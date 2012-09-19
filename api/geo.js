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

  var init, map;

  /*
   * Create size in pixel for CSS
   * ex: createSizePx('200') -> '200px'
   * @param {string} size size in pixels
   * @param {integer} offset offset in pixels
   * @return {string} size in the following format '200px'
   *                  if error: null
   */
  function createSizePx(size, offset) {
    var intSize;
    offset = (offset) ? parseInt(offset, 10) : 0;
    intSize = parseInt(size, 10) + offset;
    return isNaN(intSize) ? null : intSize.toString() + 'px';
  }

  /*
   * Parse the page URL to find a parameter value
   * @param {string} name name of the parameter
   * @return {string} value of the parameter
   *                  if error: null
   */
  function getUrlParameter(name) {
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
    this.hasLegend = false;
    this.legendWidth = '200px';
    this.legendWidthWithoutBorder = '199px';
    this.hasMetadata = false;
    this.metadataHeight = '200px';
    this.metadataHeightWithoutBorder = '199px';
  }

  /**
   * Parse and validate the URL parameters
   */
  Configuration.prototype.getUrlParameters = function () {
    this.wmcUrl = getUrlParameter('wmc') || this.wmcURL;
    this.hasLegend = (getUrlParameter('legend') === "on") || this.hasLegend;
    this.legendWidth = createSizePx(getUrlParameter('legendwidth')) || this.legendWidth;
    this.legendWidthWithoutBorder = createSizePx(this.legendWidth, -1);
    this.hasMetadata = (getUrlParameter('metadata') === "on") || this.hasMetadata;
    this.metadataHeight = createSizePx(getUrlParameter('metadataheight')) || this.metadataHeight;
    this.metadataHeightWithoutBorder = createSizePx(this.metadataHeight, -1);
  };

  /**
   * Set the size of all <div> elements
   * @param {Configuration} conf Configuration of the viewer
   */
  function createLayout(conf) {
    var wrapper1, wrapper2, wrapper3, map, legend, metadata;

    wrapper1 = document.getElementById('wrapper1');
    wrapper2 = document.getElementById('wrapper2');
    wrapper3 = document.getElementById('wrapper3');
    map = document.getElementById('map');
    legend = document.getElementById('legend');
    metadata = document.getElementById('metadata');

    if (conf.hasMetadata) {
      wrapper2.style.bottom = conf.metadataHeight;
      metadata.style.height = conf.metadataHeightWithoutBorder;
    } else {
      wrapper1.removeChild(metadata);
    }

    if (conf.hasLegend) {
      wrapper3.style.marginLeft = '-' + conf.legendWidth;
      map.setAttribute('style', 'margin-left: ' + conf.legendWidth + ' !important');
      legend.style.width = conf.legendWidthWithoutBorder;
    } else {
      wrapper2.removeChild(legend);
    }
  }

  /**
   * Fill the #legend <div>
   */
  function createLegend(conf) {
    var control, i, layer;

    if (map && conf.hasLegend && document.getElementById('legend')) {
      /* Include the legend images in the layers name */
      for (i = 0; i < map.layers.length; i += 1) {
        layer = map.layers[i];
        if (layer.metadata &&
            layer.metadata.styles[0] &&
            layer.metadata.styles[0].legend &&
            layer.metadata.styles[0].legend.href) {
          layer.name = '<img src="' + layer.metadata.styles[0].legend.href +
            '&legend_options=dpi:180;bgColor:0xFFF68F;' +
            '"/>' + layer.name;
        }
      }

      control = new OpenLayers.Control.LayerSwitcher({
        'div': OpenLayers.Util.getElement('legend')
      });
      map.addControl(control);
    }
  }

  /**
   * Fill the #metadata <div>
   */
  function createMetadata(conf) {
    var metadata, list, content, i, layer, nameStr, metadataStr;

    metadata =  document.getElementById('metadata');
    if (map && conf.hasMetadata && metadata) {
      if (map.layers.length > 0) {
        metadata.innerHTML = '<ul id="metadatalist"></ul>';
        list = document.getElementById('metadatalist');
        if (list) {
          content = '';
          for (i = 0; i < map.layers.length; i += 1) {
            layer = map.layers[i];
            nameStr = layer.name;
            metadataStr = layer.metadataURL ?
                ' (<a href="' + layer.metadataURL + '">más detalles</a>)' :
                '';
            content = content + '<li>' + nameStr + metadataStr + '</li>';
          }
          list.innerHTML = content;
        }
      }
    }
  }

  /**
   * Load the context from the  WMC specified in the URL
   * A proxy may be necessary for that function
   * http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#HowdoIsetupaProxyHost
   * @param {Configuration} conf Configuration of the viewer
   */
  function loadWmc(conf) {
    var request;

    if (!conf.wmcUrl) {
      return;
    }

    OpenLayers.ProxyHost = conf.proxy;
    request = OpenLayers.Request.GET({
      url: conf.wmcUrl,
      callback: function (request) {
        var parser;
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
        map = parser.read(request.responseXML, {map: 'map'});

        createLegend(conf);

        createMetadata(conf);
      }
    });
  }

  /**
   * Create an OpenLayers map in the #map <div>
   */
  function createMap(conf) {
    loadWmc(conf);
  }

  /**
   * Principal function launched on "onLoad" event
   */
  init = function () {
    var conf;
    conf = new Configuration();
    conf.getUrlParameters();
    createLayout(conf);
    createMap(conf);
  };

  window.onload = init;

}());