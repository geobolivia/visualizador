//variables                          
var lon = -64;
var lat = -16.5;
var zoom = 5;
var map, layer;

var logo;
var leyenda;
var titulo;
var pagweb;

var ancho_param = gup('ancho');
var alto_param = gup('alto');
var wmc_param = gup('wmc');
var pan_param = gup('pan');
var area_param = gup('area');
var distancia_param = gup('distancia');


var alturaControl;
var alturaSwitch;


ancho_param = ancho_param - 2;
alto_param = alto_param - 2;

alto_param = alto_param - 300; // se resta 300 porque el panel tiene altura 300

ancho_param = ancho_param - 100;




alturaControl = -60

alturaSwitch = 70;

//**************************************           




document.write("<div style='width:" + ancho_param + "  ; height:" + alto_param + "' id='map'></div>");

document.write("<div style='top:" + alturaControl + "' id='options' ><div id='output'></div>");

document.write("<div style='top:" + alturaSwitch + "' id='layerswitcher'> </div>");


if (pan_param == "on" || distancia_param == "on" || area_param == "on") {

    document.write("<div id='pan' style='visibility:hidden;'><input type='radio' name='type' value='none' id='noneToggle' onclick='toggleControl(this);' checked='checked' /><label for='noneToggle'>Navegar</label></div>");
    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/theme/default/img/pan_on.png' onClick='btn3Click()'>");

} else {
    document.write("<div id='pan' style='visibility:hidden;'><input type='radio' name='type' value='none' id='noneToggle' onclick='toggleControl(this);' checked='checked' /><label for='noneToggle'>Navegar</label></div>");
}


if (distancia_param == "on") {

    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/img/measuring-stick-on.png' onClick='btn1Click()'>");

}


if (area_param == "on") {

    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/theme/default/img/draw_line_on.png' onClick='btn2Click()'>");

}

//****************************

function init() {

    alturaSwitch = 300;

    map = new OpenLayers.Map('map');



    layer = new OpenLayers.Layer.WMS("Fondo GeoBolivia", "http://www.geo.gob.bo:80//geoserver/fondos/wms", {
        layers: 'openstreetmap'

    });


    map.addLayer(layer);

    map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);




    //Aqui se introdujo el parametro wmc_param que es el nombre del archivo wmc que viene en la url

    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    OpenLayers.Request.GET({
        url: wmc_param,
        callback: handler
    });

    function handler(request) {

        // hay que prever los casos de error (ver http://docs.openlayers.org/library/request.html)
        var format = new OpenLayers.Format.WMC({
            'layerOptions': {
                buffer: 0
            }
        });
        format.read(request.responseText, {
            map: map
        });
        console.debug(map.layers);

        readWMC(request.responseText);

    }


}




OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;

var format = new OpenLayers.Format.WMC({
    'layerOptions': {
        buffer: 0
    }
});
var doc, context;

function readWMC(text, merge) {

    if (merge) {
        try {
            map = format.read(text, {
                map: map
            });
        } catch (err) {
            document.getElementById("wmc").value = err;
        }
    } else {
        map.destroy();
        try {
            var jsonFormat = new OpenLayers.Format.JSON();
            var mapOptions = jsonFormat.read(OpenLayers.Util.getElement('mapOptions').value);
            map = format.read(text, {
                map: mapOptions
            });

            var numeroLayers = map.baseLayer.div.parentElement.childElementCount //numero de layers que contiene el WMC
            var nombreMostrar;
            var metadato;
            var nombreLayer;


            for (var i = 0; i < numeroLayers; i++) {


                nombreMostrar = map.layers[i].name;
                metadato = map.layers[i].name;
                nombreLayer = map.layers[i].params.LAYERS



                //metadato
                if (map.layers[i].metadataURL != null) {
                    var metadato = map.layers[i].metadataURL;
                    metadato = "<a href=" + metadato + " target='_blank' >metadato</a>";
                } else {
                    var metadato = "";

                }



                map.layers[i].name = nombreMostrar + " " + metadato;
            }



        } catch (err) {
            document.getElementById("wmc").value = err;
        }
    }




    //--------------------------------------------------------------------------            
    //Codigo para manejar WMSCapabilities y obtener el logo y el url del metadato 


    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    var request = OpenLayers.Request.GET({
        url: "http://www.geo.gob.bo/geoserver/wms?service=WMS&version=1.1.0&request=GetCapabilities",

        success: function (response) {

            var format1 = new OpenLayers.Format.XML();
            var xml = format1.read(response.responseText);

            var text = format1.write(xml);

            var CAPformat = new OpenLayers.Format.WMSCapabilities.v1_1_0();
            var cap = CAPformat.read(xml);



            for (var j = 0; j < cap.capability.layers.length; j++) {
                layer = cap.capability.layers[j];



                for (var i = 0; i < numeroLayers; i++) {

                    if (layer.name == map.layers[i].params.LAYERS) {


                        if (layer.attribution != null) {

                            if (layer.attribution.logo != null) {
                                logo = layer.attribution.logo.href;
                                leyenda = layer.styles[0].legend.href;
                                titulo = layer.attribution.title;
                                pagweb = layer.attribution.href;

                                map.layers[i].name = map.layers[i].name + "  " + "<a href=" + pagweb + "> (" + titulo + ")</a>";
                                map.layers[i].name = map.layers[i].name + " " + "<img src='" + logo + "' max-width=16 max-height=16>";
                                map.layers[i].name = map.layers[i].name + " " + "<img src='" + leyenda + "' max-width=80 max-height=80>";

                            } else {
                                logo = "";
                            }


                        }



                    }

                }


            }






            //medidor          

            // style the sketch fancy
            var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
            };
            var style = new OpenLayers.Style();
            style.addRules([
            new OpenLayers.Rule({
                symbolizer: sketchSymbolizers
            })]);
            var styleMap = new OpenLayers.StyleMap({
                "default": style
            });

            // allow testing of specific renderers via "?renderer=Canvas", etc

            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            measureControls = {
                line: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    }
                }),
                polygon: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    }
                })
            };

            var control;
            for (var key in measureControls) {
                control = measureControls[key];
                control.events.on({
                    "Medida": handleMeasurements,
                    "measurepartial": handleMeasurements
                });
                map.addControl(control);
            }

            document.getElementById('noneToggle').checked = true;


            //-----------------------------
            // cambiar el sistema de 900913 a 4326
            map.displayProjection = new OpenLayers.Projection("EPSG:4326");
            map.addControl(new OpenLayers.Control.MousePosition({
                id: "ll_mouse"
            }));




            // ESTE CÓDIGO EXTRAE EL layerswitcher DE LA CAJA DEL MAPA25           
            var ly_switchr = new OpenLayers.Control.LayerSwitcher({
                'div': OpenLayers.Util.getElement('layerswitcher')
            })
            //ly_switchr.getLegendGraphics(true);
            map.addControl(ly_switchr);



        }


    }

    )

    //  alert(leyenda);

}


// ESTA FUNCION RETORNA EL VALOR PASADO EN LA URL PARA LA VARIABLE DADA
function gup(name) {
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var tmpURL = window.location.href;
    var results = regex.exec(tmpURL);
    if (results == null) return "";
    else return results[1];
}

//*************************