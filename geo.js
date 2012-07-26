//variables                          
var lon = -64;
var lat = -16.5;
var zoom = 5;
var map, layer;

var logo;
var leyenda;
var titulo;
var pagweb;

var var_aux;
var top_mapa;
var width_Switch;
var top_Switch;
var top_Control;
var width_Leyenda;
var top_leyenda;
var height_leyenda;
var width_leyenda;


width_leyenda=150;
top_Control=-70;
var visibilidad_leyenda;
 
var leyenda_param = gup('leyenda');
var capas_param = gup('capas');
 

var ancho_param = gup('ancho');
var alto_param = gup('alto');
var wmc_param = gup('wmc');
var pan_param = gup('pan');
var area_param = gup('area');
var distancia_param = gup('distancia');


 
 
var geobol_ArrayInfo1 = new Array();
var geobol_ArrayInfo2 = new Array();

 //--------
top_mapa=2;
top_Switch=0;
width_Switch=0;
 

left_leyenda=0;
top_leyenda=0;
height_leyenda=0;
visibilidad_leyenda="visible";
//----------

//ancho_param = ancho_param +100;
 


//**************************************           
var jjj;
//**************************************        



if ( pan_param=="on" || area_param=="on" || distancia_param=="on") {
var_aux="existe";
}
else
{
var_aux="no_existe";
}


// esto es si el mapa esta solo  ( 000)
if (leyenda_param != "on" && capas_param != "on" && var_aux!="existe") {

ancho_param = ancho_param - 2;
alto_param = alto_param - 2;
top_mapa=0;
top_Switch=0;
width_Switch=0;
visibilidad_leyenda="hidden";
 
}


//esto es si existe el mapa y los controles (001)
if (leyenda_param != "on" && capas_param != "on" && var_aux=="existe") {
 
ancho_param = ancho_param - 40;
alto_param = alto_param - 40;
top_mapa=40;
top_Switch=0;
width_Switch=0;
visibilidad_leyenda="hidden";
}

 
//esto es si existe el mapa y capas (010)
if (leyenda_param != "on" && capas_param == "on" && var_aux!="existe") {

ancho_param = ancho_param - 100;
alto_param = alto_param - 100;
top_mapa=0;
top_Switch=alto_param-58;
width_Switch=ancho_param;
visibilidad_leyenda="hidden";
}


//esto es si existe el mapa y capas (011)
if (leyenda_param != "on" && capas_param == "on" && var_aux=="existe") {

ancho_param = ancho_param - 140;
alto_param = alto_param - 140;
top_mapa=40;
top_Switch=alto_param+48;
width_Switch=ancho_param;
visibilidad_leyenda="hidden";
}

//esto es si existe el mapa y capas (100)
if (leyenda_param == "on" && capas_param != "on" && var_aux!="existe") {

//ancho_param = ancho_param - 90 -width_leyenda;
ancho_param = ancho_param -width_leyenda;

alto_param = alto_param -2;
top_mapa=2;
top_Switch=0;
width_Switch=0;
 

left_leyenda=ancho_param;
top_leyenda=top_mapa;
height_leyenda=alto_param;
visibilidad_leyenda="visible";
}


//esto es si existe el mapa y leyenda (101)
if (leyenda_param == "on" && capas_param != "on" && var_aux=="existe") {

//ancho_param = ancho_param - 90 -width_leyenda;
ancho_param = ancho_param -width_leyenda;

alto_param = alto_param - 40;
top_mapa=40;
top_Switch=0;
width_Switch=0;
 

left_leyenda=ancho_param;
top_leyenda=top_mapa+10;
height_leyenda=alto_param;
visibilidad_leyenda="visible";
}

 
//esto es si existe el mapa y leyenda (110)
if (leyenda_param == "on" && capas_param == "on" && var_aux!="existe") {


height_leyenda=alto_param;

//ancho_param = ancho_param - 90 -width_leyenda;
ancho_param = ancho_param -width_leyenda;

alto_param = alto_param-100;
top_mapa=0;
top_Switch=alto_param+10;
width_Switch=ancho_param;
 
 
left_leyenda=ancho_param; 
top_leyenda=top_mapa+10;
visibilidad_leyenda="visible";

} 
 
 
//esto es si existe el mapa y leyenda (111)
if (leyenda_param == "on" && capas_param == "on" && var_aux=="existe") {

//ancho_param = ancho_param - 240
//ancho_param = ancho_param - 90 -width_leyenda;
ancho_param = ancho_param  -width_leyenda;
alto_param = alto_param-140;
top_mapa=40;
top_Switch=alto_param+50;
width_Switch=ancho_param;
 
height_leyenda=alto_param+100; 
left_leyenda=ancho_param; 
top_leyenda=top_mapa+10;
visibilidad_leyenda="visible";

}  
 
 
  


document.write("<div style='position:absolute;top:" + top_mapa + "; width:" + ancho_param + "  ; height:" + alto_param + "' id='map'></div>");

document.write("<div style='top:" + top_Control + "' id='options' ><div id='output'></div>");

document.write("<div style='top:" + "30" + "; width:" + "200" + "; left:" + "90"+ ";' id='medidores'> </div>");

document.write("<div style='top:" + top_Switch + ";height:100;width:" + width_Switch + "' id='layerinfo'> </div>");



document.write("<div style='visibility:"+visibilidad_leyenda+";top:" + top_leyenda + ";height:" + height_leyenda + ";width:" + width_leyenda + ";left:" + left_leyenda + ";' id='layerswitcher'> </div>");






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

    elem=document.body;
//    elem.style.background-color="red";
  
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

//	********	AQUI RESCATO METADATOS
            for (var i = 0; i < numeroLayers; i++) {


                nombre = map.layers[i].name;
                
                nombreLayer = map.layers[i].params.LAYERS

                //metadato
                if (map.layers[i].metadataURL != undefined) {
		    var metadato = map.layers[i].metadataURL;
                    //var metadato = map.layers[i].metadataURL;
                    metadato = "<BR> <a href=" + metadato + " target='_blank' >metadato</a>";
		    nombremetadat = nombre + " " + metadato;
		    geobol_ArrayInfo1[i] = nombremetadat;
                    geobol_ArrayInfo2[i] = nombre;
                } else {
                    var metadato = "";
//    		    nombremetadat = nombre + "" + metadato;
		    geobol_ArrayInfo1[i] = nombre;
                    geobol_ArrayInfo2[i] = nombre;
                }

//	********	PRUEBA
/*                map.layers[i].name = nombreMostrar + " " + metadato;
                if (i != 0) {
                geobol_ArrayInfo1[i+1] = nombremetadat;
                geobol_ArrayInfo2[i] = nombreMostrar;
		} else {
		  geobol_ArrayInfo2[i] = nombreMostrar;
		}*/
//	********	PRUEBA
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

	    var mivar2 = '<p></p>';
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

	    
            for (var j = 0; j < cap.capability.layers.length; j++) {
                layer = cap.capability.layers[j];


//	*********	AQUI AUMENTO AL METADATO: LINK, LOGO, LEYENDA
                for (var i = 0; i < numeroLayers; i++) {

                    if (layer.name == map.layers[i].params.LAYERS) {


                        if (layer.attribution != null) {

                            if (layer.attribution.logo != null) {
                                logo = layer.attribution.logo.href;
                                leyenda = layer.styles[0].legend.href;
                                titulo = layer.attribution.title;
                                pagweb = layer.attribution.href;

				
				
                           //     geobol_ArrayInfo1[i] = "<p>" + geobol_ArrayInfo1[i] + "  " + "<a href=" + pagweb + "> (" + titulo + ")</a>";
                          //      geobol_ArrayInfo1[i] = geobol_ArrayInfo1[i] + "<br>" + "<img src='" + logo + "' style='max-width=16 max-height=16'>";
                          //      geobol_ArrayInfo2[i] = geobol_ArrayInfo2[i] + "<br><img src='" + leyenda + "' style='max-width=80 max-height=80'>";
                                geobol_ArrayInfo1[i] = "<p>" + geobol_ArrayInfo1[i] + "<br>" + "<a href=" + pagweb + "> (" + titulo + ")</a>";
                                geobol_ArrayInfo1[i] = geobol_ArrayInfo1[i] + " " + "<img src='" + logo + "' style='max-width=16; max-height=16'>";
                                geobol_ArrayInfo2[i] = geobol_ArrayInfo2[i] + "<br><img src='" + leyenda + "' style='max-width=80; max-height=80'>";
                                
                                
                                
                                
                                
				map.layers[i].name = geobol_ArrayInfo2[i];				
				mivar2 = mivar2 + geobol_ArrayInfo1[i] + "</p>";
				
//	********	DESCOMENTAR LO Q SIGUE PARA VOLVER A LO ANTERIOR
/*                                map.layers[i].name = map.layers[i].name + "  " + "<a href=" + pagweb + "> (" + titulo + ")</a>";
                                map.layers[i].name = map.layers[i].name + " " + "<img src='" + logo + "' style='max-width=16; max-height=16'>";
                                map.layers[i].name = map.layers[i].name + " " + "<img src='" + leyenda + "' style='max-width=80; max-height=80'>";
*/
//	********	DESCOMENTAR LO PREVIO PARA VOLVER A LO ANTERIOR
//	LO SGTE FUNCIONA!!!
mivar=i+1+(i*2);
/*
document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[mivar].childNodes[0].nodeValue = geobol_ArrayInfo1[i];

document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[mivar].innerHTML = geobol_ArrayInfo1[i];
*/
document.getElementById('layerinfo').innerHTML = mivar2;
document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[mivar].innerHTML = geobol_ArrayInfo2[i];


/*
jjj=document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[4];
jjj.onclick = geobol();
*/



			    } else {
                                logo = "";
                            }


                        }



                    }

                }


            }



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

//jjj=document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[4];
//jjj.onclick = 
function geobol() {
var mielemento = document.getElementById('layerinfo').childNodes[0];
mielemento.innerHTML = "xXxXxXxXx zZzZzZzZz";
}


/*************************
function pruebaariel(a,b) {
//  var x1 = document.getElementById('layerinfo').childNodes[0];
//  var x2 = document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[4];
a.innerHTML = b.innerHTML;
}*/