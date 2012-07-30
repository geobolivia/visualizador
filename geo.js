// al 27 de julio 1836 pm

//variables    ---------                      
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
var width_switch;
var top_switch;
var top_Control;
var width_Leyenda;
var top_leyenda;
var height_leyenda;
var width_leyenda;
var top_medidores;
var left_mapa;
var left_switch;
width_leyenda=150; // 150
//width_leyenda="10%"; // 150




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

var altocapas_param = gup('altocapas');
var largoleyenda_param = gup('largoleyenda');



var top_permalink;
var visibilidad_switcher;
var margen=0;
var height_switch;
 
 
var geobol_ArrayInfo1 = new Array();
var geobol_ArrayInfo2 = new Array();
var geobol_leyenda = new Array();
 

altocapas_param=altocapas_param/100;
largoleyenda_param=largoleyenda_param/100;





//----------------------


top_control=-82//-alto_param*0.1;

 //--------
top_mapa=2;
top_Switch=0;
width_Switch=0;
 

left_leyenda=0;
top_leyenda=0;
height_leyenda=0;
height_switcher=0;
visibilidad_leyenda="visible";
visibilidad_switcher="visible";

left_mapa=0;


  
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
left_mapa=0;
visibilidad_leyenda="hidden";
visibilidad_switcher="hidden"; 
}


//esto es si existe el mapa y los controles (001)
if (leyenda_param != "on" && capas_param != "on" && var_aux=="existe") {
 
 
top_mapa=alto_param*0.04; 
 
ancho_param = ancho_param-2;
alto_param = alto_param - 40;

top_Switch=0;
width_Switch=0;


visibilidad_leyenda="hidden";
visibilidad_switcher="hidden"; 
}

 
//esto es si existe el mapa y capas (010)
if (leyenda_param != "on" && capas_param == "on" && var_aux!="existe") {



height_switch=alto_param*altocapas_param ;



top_mapa=0;
top_switch=alto_param-height_switch+4
width_switch=ancho_param;

ancho_param = ancho_param;


alto_param =alto_param - height_switch

left_switch=left_mapa;


width_Switch=ancho_param;
visibilidad_leyenda="hidden";
 
visibilidad_switcher="visible";


}


//esto es si existe el mapa y capas (011)
if (leyenda_param != "on" && capas_param == "on" && var_aux=="existe") {

height_switch=alto_param*altocapas_param ;
top_mapa=alto_param*0.04;  //40
top_switch=alto_param-height_switch+4
 
width_switch=ancho_param 
height_leyenda=alto_param-alto_param*0.035; 

ancho_param = ancho_param-2;
 
 var_aux= 83.3333 *altocapas_param -16.6667;
alto_param =alto_param - height_switch -0.15*height_switch  + var_aux ;// esta se aumento


width_switch=ancho_param;

left_leyenda=ancho_param  ; 

left_mapa=0;
left_switch=left_mapa;
 

visibilidad_leyenda="hidden";
 visibilidad_switcher="visible";
}

//esto es si existe el mapa y capas (100)
if (leyenda_param == "on" && capas_param != "on" && var_aux!="existe") {

 
top_mapa=0;

top_switch=alto_param-height_switch+4

//width_leyenda=ancho_param-0.8*ancho_param;
width_leyenda=ancho_param*largoleyenda_param;

width_switch=ancho_param-width_leyenda;
height_leyenda=alto_param; 

ancho_param = ancho_param-width_leyenda;
 
alto_param =alto_param;//+top_control

left_leyenda=ancho_param  ; 

left_mapa=0;
 
 
top_leyenda=top_mapa;

visibilidad_leyenda="visible";
visibilidad_switcher="hidden"; 
}


//esto es si existe el mapa y leyenda (101)
if (leyenda_param == "on" && capas_param != "on" && var_aux=="existe") {


height_switch=alto_param*0.2;
top_mapa=alto_param*0.04;  //40


//width_leyenda=ancho_param-0.8*ancho_param;

width_leyenda=ancho_param*largoleyenda_param;


height_leyenda=alto_param; 

ancho_param = ancho_param-width_leyenda;
 
alto_param =alto_param-alto_param*0.035; ;//+top_control



left_leyenda=ancho_param  ; 

left_mapa=0;

//top_leyenda=top_mapa; 
top_leyenda=0; 


visibilidad_leyenda="visible";
visibilidad_switcher="hidden"; 
}

 
//esto es si existe el mapa y leyenda (110)
if (leyenda_param == "on" && capas_param == "on" && var_aux!="existe") {


height_switch=alto_param*altocapas_param ;
top_mapa=0; 

 

width_leyenda=ancho_param*largoleyenda_param;

width_switch=ancho_param-width_leyenda;
height_leyenda=alto_param; 

ancho_param = ancho_param-width_leyenda;
 
alto_param =alto_param - height_switch ;//+top_control

width_switch=ancho_param;

left_leyenda=ancho_param  ; 

left_mapa=0;
left_switch=left_mapa;
top_leyenda=0;  

top_switch=alto_param ;

visibilidad_leyenda="visible";
visibilidad_switcher="visible";

} 
 
 
//esto es si existe el mapa y leyenda (111)
if (leyenda_param == "on" && capas_param == "on" && var_aux=="existe") {


//height_switch=alto_param*altocapas_param ;
height_switch=alto_param*altocapas_param ;

top_mapa=alto_param*0.04;  



top_switch=alto_param-height_switch+4  ; //var_aux


//width_leyenda=ancho_param-0.8*ancho_param;


width_leyenda=ancho_param*largoleyenda_param;

 
width_switch=ancho_param-width_leyenda;
height_leyenda=alto_param//-alto_param*0.035; 


ancho_param = ancho_param-width_leyenda;
 
 
 var_aux= 83.3333 *altocapas_param -16.6667;
alto_param =alto_param - height_switch -0.15*height_switch  + var_aux ;// esta se aumento

width_switch=ancho_param;

left_leyenda=ancho_param  ; //left_leyenda=ancho_param+20; 

left_mapa=0;
left_switch=left_mapa;
top_leyenda=0;   
visibilidad_leyenda="visible";
visibilidad_switcher="visible";

}  
 
 
top_permalink=alto_param+0.05* alto_param;

 
 
  
document.write("<div style='visibility:"+visibilidad_leyenda+";top:" + top_leyenda + ";height:" + height_leyenda + ";width:" + width_leyenda + ";left:" + left_leyenda + ";' id='layerswitcher'> </div>");


document.write("<div style='position:absolute;top:" + top_mapa + "; left:" + left_mapa+ " ; width:" + ancho_param + "  ; height:" + alto_param + " ; padding:10px' id='map'></div>");


document.write("<div style='top:5 ; width:" + "200" + "; left:" + "110"+ ";' id='medidores'> </div>");


document.write("<div style='visibility:"+visibilidad_switcher+";top:" + top_switch + "; left:" + left_switch+ " ;height:" + height_switch + " ; width:" + width_switch + "' id='layerinfo'> </div>");





document.write("<div style='position:absolute;top:" + top_control + "' id='options' ><div id='output'></div>");

//enlace a GeoBolivia 
document.write("<div id='Enlace' class='olControlPermalink olControlNoSelect' style='position:absolute;left:" + left_mapa+ " ; top:" + top_permalink + "' unselectable='on'><a href='http://www.geo.gob.bo' target='_blank' >GeoBolivia (Infraestructura de Datos Espaciales)</a></div>");







if (pan_param == "on" || distancia_param == "on" || area_param == "on") {

    document.write("<div id='pan' style='visibility:hidden;'><input type='radio' name='type' value='none' id='noneToggle' onclick='toggleControl(this);' checked='checked' /><label for='noneToggle'>Navegar</label></div>");
    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/theme/default/img/pan_off.png' onClick='btn3Click()'>");

} else {
    document.write("<div id='pan' style='visibility:hidden;'><input type='radio' name='type' value='none' id='noneToggle' onclick='toggleControl(this);' checked='checked' /><label for='noneToggle'>Navegar</label></div>");
}


if (distancia_param == "on") {

    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/theme/default/img/ruler.png' onClick='btn1Click()'>");

}


if (area_param == "on") {

    document.write(" <img name='image1' src='http://www.geo.gob.bo/lib/OpenLayers/theme/default/img/draw_polygon_off.png' onClick='btn2Click()'>");

}

//****************************

function init() {

    elem=document.body;
//    elem.style.background-color="red";
  
 

    map = new OpenLayers.Map('map');



    layer = new OpenLayers.Layer.WMS("Fondo GeoBolivia", "http://www.geo.gob.bo:80//geoserver/fondos/wms", {
        layers: 'openstreetmap'

    });


    map.addLayer(layer);

    map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);




    //Aqui se introdujo el parametro wmc_param que es el nombre del archivo wmc que viene en la url

    // MIENTRAS NO ARREGLEMOS EL PROXY, PARA TRABAJAR DESCOMENTAR LAS LINEAS 278 Y 390, Y COMENTAR LA 279 Y LA 391
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    //OpenLayers.ProxyHost = "http://www-dev.geo.gob.bo/proxy/?url=";

    
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
                    metadato = " <a href=" + metadato + " target='_blank' >(Metadato)</a>";
		    nombremetadat = nombre + metadato;
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
    //OpenLayers.ProxyHost = "http://www.geo.gob.bo/proxy/?url=";

    var request = OpenLayers.Request.GET({
        url: "http://www.geo.gob.bo/geoserver/wms?service=WMS&version=1.1.0&request=GetCapabilities",

        success: function (response) {

            var format1 = new OpenLayers.Format.XML();
            var xml = format1.read(response.responseText);

            var text = format1.write(xml);

            var CAPformat = new OpenLayers.Format.WMSCapabilities.v1_1_0();
            var cap = CAPformat.read(xml);



//comentario de Geobolivia







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

	    var mivar2='';
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
				geobol_leyenda[i] = leyenda + "&legend_options=fontSize:9";
//				leyenda = encodeURIComponent(leyenda);
                                titulo = layer.attribution.title;
                                pagweb = layer.attribution.href;

				
				
                           //     geobol_ArrayInfo1[i] = "<p>" + geobol_ArrayInfo1[i] + "  " + "<a href=" + pagweb + "> (" + titulo + ")</a>";
                          //      geobol_ArrayInfo1[i] = geobol_ArrayInfo1[i] + "<br>" + "<img src='" + logo + "' style='max-width=16 max-height=16'>";
                          //      geobol_ArrayInfo2[i] = geobol_ArrayInfo2[i] + "<br><img src='" + leyenda + "' style='max-width=80 max-height=80'>";
                                geobol_ArrayInfo1[i] = '<p class="p_layerinfo">' + geobol_ArrayInfo1[i] + "<br><a href=" + pagweb + "> (" + titulo + ")</a>";
                                geobol_ArrayInfo1[i] = geobol_ArrayInfo1[i] + " " + "<img src='" + logo + "' style='max-width=16; max-height=16'>";
				// ARTIFICIO-LEYENDA
                                geobol_ArrayInfo2[i] = geobol_ArrayInfo2[i] +  "<br><img src='" + geobol_leyenda[i] + "' style='max-width=16; max-height=16'>";
				//LA SIGUIENTE FUNCION SACA LA LEYENDA A SU PROPIO TAG FUERA DEL LABEL, AUNQUE NO LOGRA PERSISTIR
//				geobol_leyenda[i] = "<img src='" + leyenda + "'>";
                                
                                
// EN LA SGTE LINEA SE LE ASIGNA EL STRING HTML FORMADO AL LABEL DEL FRAMESWITCHER                                
				map.layers[i].name = geobol_ArrayInfo2[i];
				mivar2 = mivar2 + geobol_ArrayInfo1[i] + '</p>';
				//geobolivia_leyenda(geobol_leyenda[i],i);
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

// LA SIGUIENTE LINEA DE CODIGO ES REDUNDANTE A "map.layers[i].name = geobol_ArrayInfo2[i];" Y ES UN ARTIFICIO PARA QUE PERSISTA LA "INYECCIÓN DOM" DEL GRAFICO DE LA LEYENDA DENTRO DE LOS LABELS DEL LAYERSWITCHER
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

function geobolivia_leyenda(x,y) {
  var mi_img = document.createElement("img");
  var img_padre = document.getElementById("layerswitcher").childNodes[1].childNodes[3];
  var img_hijos = img_padre.getElementsByTagName("br");
  mi_img.setAttribute("src",x);
  //return mi_img;
  img_padre.insertBefore(mi_img,img_hijos[y]);
}

function geobolivia_leyenda2() {
              for (var i = 0; i < map.layers.length; i++) {
		geobolivia_leyenda(geobol_leyenda[i],i);
	      }
}

// PARA IR TRABAJANDO EN UN CODIGO JS QUE NOS PERMITA PARSEAR URLS PARA AÑADIR O QUITAR PARAMETROS!!! ...stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript

//jjj=document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[4];
//jjj.onclick = 
/*
function geobol() {
var mielemento = document.getElementById('layerinfo').childNodes[0];
mielemento.innerHTML = "xXxXxXxXx zZzZzZzZz";
}

function leyenda_urls(argum) {
 var encodLeyenda = encodeURIComponent(argum);
 return encodLeyenda;
}

/*************************
function pruebaariel(a,b) {
//  var x1 = document.getElementById('layerinfo').childNodes[0];
//  var x2 = document.getElementById('layerswitcher').childNodes[1].childNodes[3].childNodes[4];
a.innerHTML = b.innerHTML;
}*/