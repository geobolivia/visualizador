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

/*(function () {*/
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
    this.proxy = "/proxy/?url=";
    this.hasLegend = false;
    this.legendWidthWithin = '199px';
    this.legendWidth = '200px';
    this.hasMetadata = false;
    this.metadataHeightWithin = '199px';
    this.metadataHeight = '200px';
    this.hasTools = false;
    this.toolsHeightWithin = '28px';
    this.toolsBorder = '1px';
    this.toolsHeight = '29px';
    this.hasMeasureTools = false;
  }

  /**
   * Parse and validate the URL parameters
   */
  Configuration.prototype.getUrlParameters = function () {
    this.wmcUrl = getUrlParameter('wmc') || this.wmcURL;
    this.hasLegend = (getUrlParameter('legend') === "on") || this.hasLegend;
    this.legendWidth = createSizePx(getUrlParameter('legendwidth')) || this.legendWidth;
    this.legendWidthWithin = createSizePx(this.legendWidth, -1);
    this.hasMetadata = (getUrlParameter('metadata') === "on") || this.hasMetadata;
    this.metadataHeight = createSizePx(getUrlParameter('metadataheight')) || this.metadataHeight;
    this.metadataHeightWithin = createSizePx(this.metadataHeight, -1);
    this.hasTools = (getUrlParameter('tools') === "on") || this.hasTools;
    this.hasMeasureTools = (getUrlParameter('measuretools') === "on") || this.hasMeasureTools;
  };

  /**
   * Set the size of all <div> elements
   * @param {Configuration} conf Configuration of the viewer
   */
  function createLayout(conf) {
    var wrapper1, wrapper2, wrapper3, wrapper4, map, legend, metadata, tools,
      icons, measure;

    wrapper1 = document.getElementById('wrapper1');
    wrapper2 = document.getElementById('wrapper2');
    wrapper3 = document.getElementById('wrapper3');
    wrapper4 = document.getElementById('wrapper4');
    map = document.getElementById('map');
    legend = document.getElementById('legend');
    metadata = document.getElementById('metadata');
    tools = document.getElementById('tools');
    icons = document.getElementById('icons');
    measure = document.getElementById('measure');

    if (conf.hasTools) {
      wrapper4.style.top = conf.toolsHeight;
      tools.style.height = conf.toolsHeightWithin;
      tools.style.borderBottom = conf.toolsBorder + ' solid black';
      if (!conf.hasMeasureTools) {
        tools.removeChild(measure);
      }
    } else {
      wrapper3.removeChild(tools);
    }

    if (conf.hasMetadata) {
      wrapper2.style.bottom = conf.metadataHeight;
      metadata.style.height = conf.metadataHeightWithin;
    } else {
      wrapper1.removeChild(metadata);
    }

    if (conf.hasLegend) {
      wrapper3.style.marginLeft = '-' + conf.legendWidth;
      tools.style.marginLeft = '-' + conf.legendWidth;
      icons.style.marginLeft = conf.legendWidth;
      wrapper4.style.marginLeft = '-' + conf.legendWidth;
      map.setAttribute('style', 'margin-left: ' + conf.legendWidth + ' !important');
      legend.style.width = conf.legendWidthWithin;
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
          layer.name = layer.name +
            '<br/><img src="' + layer.metadata.styles[0].legend.href + '"/>';
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

  /*
   * Show the line measurement within the #measure <div>
   * Units are in the metric system
   * @param {OpenLayers.Events} event Event of the line measurement
   */
  function handleLineMeasure(event) {
    var element, out;
    element = document.getElementById('measure');
    out = "";
    if (event.order === 1) {
      /* Trick for the number format: http://stackoverflow.com/a/4689230 */
      out += "longitud: " + event.measure.toPrecision(4) + " " + event.units;
    }
    element.innerHTML = out;
  }

  /*
   * Show the area measurement within the #measure <div>
   * Units are in the metric system
   * @param {OpenLayers.Events} event Event of the area measurement
   */
  function handleAreaMeasure(event) {
    var element, out;
    element = document.getElementById('measure');
    out = "";
    if (event.order === 2) {
      /* Trick for the number format: http://stackoverflow.com/a/4689230 */
      out += "superficie: " + Number(event.measure.toPrecision(4)) + " " +
        event.units + "<sup>2</" + "sup>";
    }
    element.innerHTML = out;
  }

  /**
   * Fill the #tools <div>
   */
  function createTools(conf) {
    var tools, icons, measure, panelCtl, fakePanCtl, navCtl, lineMeasureCtl,
      areaMeasureCtl;

    tools =  document.getElementById('tools');
    icons =  document.getElementById('icons');
    measure =  document.getElementById('measure');
    if (map && conf.hasTools && tools && icons) {
      /* Controls */
      navCtl = new OpenLayers.Control.NavigationHistory(
        {'displayClass': 'hist'}
      );
      fakePanCtl = new OpenLayers.Control(
        {displayClass: 'pan'}
      );
      /* Controls panel */
      panelCtl = new OpenLayers.Control.Panel(
        {
          'div': icons,
          'defaultControl': fakePanCtl
        }
      );
      /* Add to map */
      map.addControl(navCtl);
      panelCtl.addControls([
        navCtl.previous,
        navCtl.next,
        fakePanCtl
      ]);
      if (conf.hasMeasureTools && measure) {
        lineMeasureCtl = new OpenLayers.Control.Measure(
          OpenLayers.Handler.Path,
          {
            persist: true,
            immediate: true,
            displayClass: 'path'
          }
        );
        lineMeasureCtl.events.on({
          "measure": handleLineMeasure,
          "measurepartial": handleLineMeasure
        });
        areaMeasureCtl = new OpenLayers.Control.Measure(
          OpenLayers.Handler.Polygon,
          {
            persist: true,
            immediate: true,
            displayClass: 'polygon'
          }
        );
        areaMeasureCtl.events.on({
          "measure": handleAreaMeasure,
          "measurepartial": handleAreaMeasure
        });
        panelCtl.addControls([
          lineMeasureCtl,
          areaMeasureCtl
        ]);
      }
      map.addControl(panelCtl);
    }
  }

  /**
   * Remove the ajaxloader image
   */
  function removeAjaxLoader() {
    var ajaxloader;
    ajaxloader = document.getElementById('ajaxloader');
    if (ajaxloader) {
      ajaxloader.parentNode.removeChild(ajaxloader);
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
        var format, context, i;
        if (request.status < 200 || request.status >= 300) {
          // Error
          alert("Error de status " + request.status);
          return;
        }
        if (!request.responseText) {
          // Error
          alert("Error de responseText");
          return;
        }
        format = new OpenLayers.Format.WMC();
        OpenLayers.DOTS_PER_INCH = 90.71428571428572;
        context = format.read(request.responseText);
        map = format.contextToMap(context, {
          div: 'map',
          allOverlays: true,
          units: 'm',
          resolutions: [19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.4962261718748, 305.7481130859374, 152.87405654296887, 76.43702827148444, 38.21851413574208, 19.10925706787104, 9.55462853393552, 4.77731426696776],
          projection: new OpenLayers.Projection('EPSG:900913'),
          maxExtent: new OpenLayers.Bounds(-8500000.0, -2900000.0, -3490622.9151999997, 2109377.0848000003)
        });
        for (i = 0; i < map.layers.length; i += 1) {
          map.layers[i].gutter = 10;
          map.layers[i].setTileSize(new OpenLayers.Size(256, 256));
        }
        createLegend(conf);
        createMetadata(conf);
        createTools(conf);
        removeAjaxLoader();
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

/*}());*/