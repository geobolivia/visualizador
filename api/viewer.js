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
  this.metadataHeightWithin = '190px';
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
  this.metadataHeightWithin = createSizePx(this.metadataHeight, -10);
  this.hasTools = (getUrlParameter('tools') === "on") || this.hasTools;
  this.hasMeasureTools = (getUrlParameter('measuretools') === "on") || this.hasMeasureTools;
};

/**
 * Set the size of all <div> elements
 * @param {Configuration} conf Configuration of the viewer
 */
function createLayout(conf) {
  var wrapper1, wrapper2, wrapper3, wrapper4, map, legend, metadata, tools, icons, measure;

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
    tools.style.borderBottomWidth = conf.toolsBorder;
    if (!conf.hasMeasureTools) {
      tools.removeChild(measure);
    }
  } else {
    wrapper3.removeChild(tools);
  }

  if (conf.hasMetadata) {
    wrapper2.style.bottom = conf.metadataHeight;
    metadata.style.height = conf.metadataHeightWithin;
    metadata.style.display = 'block';
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
 * Add an item in the <ul> list of the #metadata <div>
 * @param {Array} capLayer Layer array extracted from GetCapabilities response
 */
function addMetadataItem(capLayer) {
  var metadataUl, item, li, attr;
  metadataUl = document.getElementById('metadata-ul');
  if (capLayer && metadataUl) {
    item = '';
    if (capLayer.title) {
      item += "<span class='title'>" + capLayer.title + "</span>";
    }
    if (capLayer.metadataURLs.length > 0) {
      if (capLayer.metadataURLs[0].href) {
        item += "<span class='metadata-url'><a href='" +
          capLayer.metadataURLs[0].href +
          "'>Más información</a></span>";
      }
    }
    if (capLayer.attribution) {
      attr = '';
      if (capLayer.attribution.title) {
        attr += capLayer.attribution.title;
      }
      if (capLayer.attribution.logo && capLayer.attribution.logo.href) {
        attr += "<img src='" + capLayer.attribution.logo.href + "'/>";
      }
      if (capLayer.attribution.href) {
        attr = "<a href='" + capLayer.attribution.href + "'>" + attr + "</a>";
      }
      item += "<span class='attribution'>" + attr + "</span>";
    }
    li = document.createElement('li');
    li.innerHTML = item;
    metadataUl.appendChild(li);
  }
}

/**
 * Get metadata of the layers using GetCapabilities
 * Put the results as properties of the layers
 */
function callbackGetCapabilities(request) {
  var xmlFormat, responseXml, capFormat, capObj, capLayers, i, j, capLayer,
    layer, attr;
  xmlFormat = new OpenLayers.Format.XML();
  capFormat = new OpenLayers.Format.WMSCapabilities();
  if (request.status < 200 || request.status >= 300) {
    // Error
    /*alert("Error de status " + request.status);*/
    return;
  }
  if (!request.responseText) {
    // Error
    /*alert("Error de responseText");*/
    return;
  }
  /*if (!request.responseXml) {
  } else {
    responseXml = request.responseXml;
  }*/
  responseXml = xmlFormat.read(request.responseText);
  capObj = capFormat.read(responseXml);
  capLayers = capObj.capability.layers;
  if (map && map.layers.length > 0) {
    for (j = 0; j < map.layers.length; j += 1) {
      for (i = 0; i < capLayers.length; i += 1) {
        capLayer = capLayers[i];
        layer = map.layers[j];
        if (layer.params.LAYERS === capLayer.name) {
          /* Match */
          addMetadataItem(capLayer);
        }
      }
    }
  }
}

/**
 * Get metadata of the layers using GetCapabilities
 * Put the results as properties of the layers
 */
function getRemoteMetadata() {
  var i, layer, wmsUrls, urlOrig, version, urlObj, url;
  if (map && map.layers.length > 0) {
    wmsUrls = [];

    /* Prepare the WMS URL (various layers may share the same WMS URL) */
    for (i = 0; i < map.layers.length; i += 1) {
      layer = map.layers[i];

      /* Refactor the URL to avoid :80/ */
      urlOrig = layer.url;
      version = layer.params.VERSION;
      if (urlOrig && version) {
        urlObj = OpenLayers.Util.createUrlObject(urlOrig);
        url = urlObj.protocol + '//' + urlObj.host;
        if (urlObj.port && urlObj.port !== "80") {
          url += ':' + urlObj.port;
        }
        url += urlObj.pathname;
        urlObj.args.REQUEST = "GetCapabilities";
        urlObj.args.VERSION = version;
        url = OpenLayers.Util.urlAppend(
          url,
          OpenLayers.Util.getParameterString(urlObj.args)
        );
        if (wmsUrls.indexOf(url) < 0) {
          wmsUrls.push(url);
        }
      }
    }

    for (i = 0; i < wmsUrls.length; i += 1) {
      OpenLayers.Request.GET({
        url: wmsUrls[i],
        callback: callbackGetCapabilities,
        async: false
      });
    }

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
      getRemoteMetadata();
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
  var tools, icons, measure, panelCtl, fakePanCtl, navCtl, lineMeasureCtl, areaMeasureCtl;

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
function loadWmc(conf, protocol) {
  var request, urlObj, url;
  if (!conf.wmcUrl) {
    return;
  }
  urlObj = OpenLayers.Util.createUrlObject(conf.wmcUrl);
  if (!protocol) {
    protocol = urlObj.protocol;
  }
  url = protocol + '//' + urlObj.host;
  if (urlObj.port && urlObj.port !== "80") {
    url += ':' + urlObj.port;
  }
  url += urlObj.pathname;
  url = OpenLayers.Util.urlAppend(
    url,
    OpenLayers.Util.getParameterString(urlObj.args)
  );
  request = OpenLayers.Request.GET({
    url: url,
    async: false,
    callback: function (request) {
      var format, context, i, MAP_SCALES, options;
      if (request.status < 200 || request.status >= 300) {
        // Error
        /*alert("Error de status " + request.status);*/
        return;
      }
      if (!request.responseText) {
        // Error
        /*alert("Error de responseText");*/
        return;
      }
      format = new OpenLayers.Format.WMC();
      OpenLayers.DOTS_PER_INCH = 90.71428571428572;
      context = format.read(request.responseText);
      map = format.contextToMap(context, {
        div: 'map',
        allOverlays: true,
        units: 'm',
        projection: new OpenLayers.Projection('EPSG:900913'),
        maxExtent: new OpenLayers.Bounds(
          -8500000.0,
          -2900000.0,
          -3490622.9151999997,
          2109377.0848000003
        )
      });
      /* Change the map scale */
      MAP_SCALES = [
        4265.459166936,
        8530.918333871,
        17061.836667742,
        34123.673335484,
        68247.346670968,
        136494.693341936,
        272989.386683873,
        545978.773367746,
        1091957.546735491,
        2183915.093470982,
        4367830.186941965,
        8735660.373883929
      ];
      options = { scales: MAP_SCALES };
      map.setOptions(options);
      for (i = 0; i < map.layers.length; i += 1) {
        map.layers[i].gutter = 10;
        map.layers[i].setTileSize(new OpenLayers.Size(256, 256));
        map.layers[i].addOptions(options, true);
      }
      createLegend(conf);
      createMetadata(conf);
      createTools(conf);
      removeAjaxLoader();
    }
  });
  return request;
}

/**
 * Create an OpenLayers map in the #map <div>
 */
function createMap(conf) {
  var request;
  request = loadWmc(conf);
  if (request.status < 200 || request.status >= 300 || !request.responseText) {
    // probamos en HTTP por si acaso
    request = loadWmc(conf, 'http:');
  }
}

/**Generaates a GetFreature information onclick event
*/
function enableGetFeature()
{

	map.events.register('click', map, function (e) {
 					mouseLoc = map.getLonLatFromPixel(e.xy);
                    document.getElementById('responseData').innerHTML = "Loading... please wait...";
					var format = 'image/png';
                    var params = {
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: map.getExtent().toBBOX(),
                        SERVICE: "WMS",
                        INFO_FORMAT: 'text/plain',
                        QUERY_LAYERS: 'departamentos',
                        FEATURE_COUNT: 50,
                        Layers: 'departamentos',
                        WIDTH: map.size.w,
                        HEIGHT: map.size.h,
                        format: 'image/png',
                        styles: map.layers[0].params.STYLES,
                        srs: map.layers[0].params.SRS};
                    // handle the wms 1.3 vs wms 1.1 madness
                    if(map.layers[0].params.VERSION == "1.3.0") {
                        params.version = "1.3.0";
                        params.j = e.xy.x;
                        params.i = e.xy.y;
                    } else {
                        params.version = "1.1.1";
                        params.x = e.xy.x;
                        params.y = e.xy.y;
                    }
                        
                    // merge filters
                    if(map.layers[0].params.CQL_FILTER != null) {
                        params.cql_filter = map.layers[0].params.CQL_FILTER;
                    } 
                    if(map.layers[0].params.FILTER != null) {
                        params.filter = map.layers[0].params.FILTER;
                    }
                    if(map.layers[0].params.FEATUREID) {
                        params.featureid = map.layers[0].params.FEATUREID;
                    }
                    OpenLayers.loadURL("http://mapas.vicepresidencia.gob.bo/geoserver/AtlasElectoral/wms", params, this, setHTML, setHTML);
                    OpenLayers.Event.stop(e);
                });
            



}
// Global vars for popup use
var popup;
var mouseLoc;
// parse the response provided into the popup
            function setHTML(response){
 			var lines = response.responseText.split('\n');
			var depto,km2;
			for (var lcv = 0; lcv < (lines.length); lcv++) {
		            var vals = lines[lcv].replace(/^\s*/,'').replace(/\s*$/,'').replace(/ = /,"=").replace(/'/g,'').split('=');
            		if (vals[1] == "") {
                		vals[1] = "Desconocido";
                    }

            		if (vals[0].indexOf('nombre') != -1 ) {
                		depto = vals[1];
            		} else if (vals[0].indexOf('area_km2') != -1 ) {
                		km2 = vals[1];
					}
            }
        

				var popup_info = "<img alt=\"Logotipo de GeoBolivia\" src=\"img/geologo_16x16.png\"><h2>" + 
depto + "</h2><hr/>" +
                        "<b>&aacute;rea:</b> " + parseFloat(km2).toFixed(3) +
                        " km2 <hr/>";
  				if (popup != null) {
            		popup.destroy();
            		popup = null;
		        }
        		popup = new OpenLayers.Popup.AnchoredBubble("Informion de DEpartamento",
                                        mouseLoc,
                                        new OpenLayers.Size(250,120),
                                        popup_info,
                                        null,
                                        true);
        popup.setBackgroundColor("#bcd2ee");
        map.addPopup(popup);
                document.getElementById('responseData').innerHTML = popup_info;   

            };
            

/**
 * Principal function launched on "onLoad" event
 */
init = function () {
  var conf;
  conf = new Configuration();
  OpenLayers.ProxyHost = conf.proxy;
  conf.getUrlParameters();
  createLayout(conf);
  createMap(conf);
//method added by Norman Huasebe
  enableGetFeature();
};

window.onload = init;

/*}());*/