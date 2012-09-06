function btn1Click() {
  for (key in measureControls) {
    var control = measureControls[key];
    if ("line" == key) {
      control.activate();
    } else {
      control.deactivate();
    }
  }
}

function btn2Click() {
  for (key in measureControls) {
    var control = measureControls[key];
    if ("polygon" == key) {
      control.activate();
    } else {
      control.deactivate();
    }
  }
}

function btn3Click() {
  for (key in measureControls) {
    var control = measureControls[key];
    if ("none" == key) {
      control.activate();
    } else {
      control.deactivate();
    }
  }
}

//Estas funciones son para las herramientas
function handleMeasurements(event) {
  var geometry = event.geometry;
  var units = event.units;
  var order = event.order;
  var measure = event.measure;
  var element = document.getElementById('medidores');
  var out = "";
  if (order == 1) {
    out += "Medida: " + measure.toFixed(3) + " " + units;
  } else {
    out += "Medida: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
  }
  element.innerHTML = out;
}

function toggleControl(element) {
  for (key in measureControls) {
    var control = measureControls[key];
    if (element.value == key && element.checked) {
      control.activate();
    } else {
      control.deactivate();
    }
  }
}

function toggleGeodesic(element) {
  for (key in measureControls) {
    var control = measureControls[key];
    control.geodesic = element.checked;
  }
}

function toggleImmediate(element) {
  for (key in measureControls) {
    var control = measureControls[key];
    control.setImmediate(element.checked);
  }
}
