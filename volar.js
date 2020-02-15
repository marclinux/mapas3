// JavaScript Document
const chiapas = [17.5565300, -93.3810400];
const munZoom = 14;
//const dataURL = 'http://ssaiij-env.6ph4ziu36y.us-east-1.elasticbeanstalk.com/proyectos.php';
const municipiosURL = 'http://localhost/mapas3/municipios_controller.php';
const proyectosURL = 'http://localhost/mapas3/proyectos_controller.php';
const temasURL = 'http://localhost/mapas3/temas_controller.php';
const map = L.map('map').setView(chiapas, 8);
let markets = [];

let cities = [
  { coords: [17.51, -91.9815], name: 'Palenque' },
  { coords: [16.2498, -92.1317], name: 'Comitán' },
  { coords: [16.7376, -92.6367], name: 'San Cristóbal de las Casas' },
  { coords: [14.9, -92.2667], name: 'Tapachula' },
  {
    coords: [16.75, -93.1167],
    name: 'Tuxtla Gutiérrez',
    projects: [
    ]
  },
  { coords: [16.5535, -92.8069], name: 'Acala' },
];

const changeLoactionFn = (coords, msj = '', zoom = munZoom) => {
  /*if (msj !== '') {
    L.marker(coords).bindPopup(msj).addTo(map);
  } else {
    L.marker(coords).addTo(map);
  }*/
  map.flyTo(coords, zoom);
}

const addMarkets = (marks = null) => {
  if (!marks) { return; }
  marks.forEach(element => {
    if (element.cve_tema == 1) {
      var myIcon = L.icon({
        iconUrl: 'iconRojo.png',
        iconSize: [32, 32],
        iconAnchor: [22, 31],
        popupAnchor: [-3, -76]
      });
    }
    else if (element.cve_tema == 2) {
      var myIcon = L.icon({
        iconUrl: 'iconAzul.png',
        iconSize: [32, 32],
        iconAnchor: [22, 31],
        popupAnchor: [-3, -76]
      });
    }
    else {
      var myIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [32, 32],
        iconAnchor: [21, 31],
        popupAnchor: [-3, -76]
      });
    }
    if (element.coords) {
      marker = new L.marker(element.coords, { icon: myIcon })
        // .bindPopup(`<strong>${element.email}</strong><br/><p>${element.description}</p>`)
        .bindPopup(`<strong>${element.email}</strong><br/><p>${element.description}</p><strong>${element.coords}
                    </strong><br/><p>${element.id}</p><p>tema: ${element.cve_tema}</p>`)

        .addTo(map);
      markets.push(marker);
    }
  });
}

const removeMarkets = () => {
  if (markets && markets.length) {
    markets.forEach(marker => {
      map.removeLayer(marker);
    });
  }
  markets = [];
}

const getJSON = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

const getData = () => {
  // Recupero los municipios
  const divSelectMunicipios = document.getElementById('select-location');
  //divSelectMunicipios.innerHTML = `Cargando...`
  getJSON(municipiosURL,
    (err, data) => {
      if (err !== null) {
        alert('Error: ' + err);
      } else {
        cities = data;
        let options = `<option value="-1">Selecciona un municipio:</option>`;
        cities.forEach(city => {
          options += `<option value="${city.id}">${city.name}</option>`;
        });
        //divSelectMunicipios.innerHTML = `<select name="location" id="location"> ${options} </select>`;
        selectMunicipios = document.getElementById('location');
        selectMunicipios.innerHTML = options;
        selectMunicipios.addEventListener('change', e => {
          idSeleccionado = selectMunicipios.value;
          city = cities.find(city => city.id === idSeleccionado);
          changeLoactionFn(city.coords, city.name);
          url = proyectosURL + "?cve_mun=" + parseInt(idSeleccionado) + "&cve_tema=0";
          getJSON(url,
            (err, data) => {
              if (err !== null) {
                alert('Error: ' + err);
              } else {
                projects = data;
                /*selectTemas = document.getElementById('temas');
                selectTemas.selectedIndex = 0;*/
                removeMarkets();
                addMarkets(projects);
              }
            });
        });
      }
    });
  // Ahora recupero los temas
  const divSelectTemas = document.getElementById('select-temas');
  divSelectTemas.innerHTML = `Cargando...`
  getJSON(temasURL,
    (err, data) => {
      if (err !== null) {
        alert('Error: ' + err);
      } else {
        temas = data;
        let options = `<option value="0">--Todos los temas</option>`;
        temas.forEach(tema => {
          options += `<option value="${tema.id}">${tema.name}</option>`;
        });
        divSelectTemas.innerHTML = `<select name="temas" id="temas"> ${options} </select>`;
        selectTemas = document.getElementById('temas');
        selectTemas.addEventListener('change', e => {
          idSeleccionado = selectMunicipios.value;
          city = cities.find(city => city.id === idSeleccionado);
          url = proyectosURL + "?cve_mun=" + parseInt(idSeleccionado) + "&cve_tema=" + selectTemas.value;
          getJSON(url,
            (err, data) => {
              if (err !== null) {
                alert('Error: ' + err);
              } else {
                projects = data;
                removeMarkets();
                addMarkets(projects);
              }
            });
        });
      }
    });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //let marker = L.marker([16.7376, -92.6367]).addTo(myMap);
}).addTo(map);


getData();

//let marker = L.marker([16.7376, -92.6367]).addTo(myMap);