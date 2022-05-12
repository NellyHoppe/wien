/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 16,
    layers: [
        startLayer
    ]
})

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "Basemap Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "Basemap High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "Basemap Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "Basemap Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "Basemap Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "Basemap Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap mit Orthofoto und Beschirftung": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay"),
    ])
}).addTo(map);

layerControl.expand();

/*let sightLayer = L.featureGroup().addTo(map);

layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer)*/

// Maßstab hinzufügen
L.control.scale({
    imperial: false,
}).addTo(map);

L.control.fullscreen().addTo(map);

let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"), {
        toggleDisplay: true
    }
).addTo(map)

// Sehenswürdigkeiten
async function loadSights(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    // console.log(geojson);

    let overlay = L.featureGroup().addTo(map);
    layerControl.addOverlay(overlay, "Sehenswürdigkeiten");

    L.geoJson(geojson, {
        pointToLayer: function(geoJsonPoint, latlng) {
            // L.marker(latlng).addTo(map)
            //console.log(geoJsonPoint.properties.NAME);
            let popup = `
                <img src="${geoJsonPoint.properties.THUMBNAIL}"alt=""><br>
                <strong>${geoJsonPoint.properties.NAME}</strong>
                <hr>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEITERE_INF}">Weblink</a>
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

// Haltestellen Vienna Sightseeing
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    // console.log(geojson);

    let overlay = L.featureGroup().addTo(map);
    layerControl.addOverlay(overlay, "Haltestellen Vienna Sightseeing");

    L.geoJson(geojson, {
        pointToLayer: function(geoJsonPoint, latlng) {
            // L.marker(latlng).addTo(map)
            // console.log(geoJsonPoint.properties);
            let popup = `
                <strong/>${geoJsonPoint.properties.LINE_NAME}</strong><br>
                Station ${geoJsonPoint.properties.STAT_NAME}
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/busstop_${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

//Liniennetz Vienna Sightseeing
async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    let overlay = L.featureGroup().addTo(map);
    layerControl.addOverlay(overlay, "Liniennetz Vienna Sightseeing");

    L.geoJson(geojson).bindPopup(function (layer) {
        return `
            <h4>${layer.feature.properties.LINE_NAME}</h4>
            von: ${layer.feature.properties.FROM_NAME}
            <br>
            nach: ${layer.feature.properties.TO_NAME}
        `
        // return layer.feature.properties.LINE_NAME;
    }).addTo(overlay);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")

// Fußgängerzonen
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    // console.log(geojson);

    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Fußgängerzonen");

    L.geoJson(geojson).addTo(overlay)
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

//Hotels
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    // console.log(geojson);

    let overlay = L.featureGroup().addTo(map);
    layerControl.addOverlay(overlay, "Hotels und Unterkünfte");

    L.geoJson(geojson, {
        pointToLayer: function(geoJsonPoint, latlng) {
            // L.marker(latlng).addTo(map)
            // console.log(geoJsonPoint.properties.BETRIEBSART_TXT);
            let popup = `
                <strong/>${geoJsonPoint.properties.BETRIEB}</strong><br>
                <hr>
                Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
                Kategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                Telefonnummer: ${geoJsonPoint.properties.KONTAKT_TEL}<br>
                <a href="mailto:${geoJsonPoint.properties.KONTAKT_EMAIL}">${geoJsonPoint.properties.KONTAKT_EMAIL}</a><br>
                <a href="${geoJsonPoint.properties.WEBLINK1}"  target="_blank">Weblink</a>
            `;
            if (geoJsonPoint.properties.BETRIEBSART == "H"){
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: `icons/hotel_0star.png`,
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else if (geoJsonPoint.properties.BETRIEBSART == "P"){
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: `icons/lodging_0star.png`,
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: `icons/apartment-2.png`,
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            }
        }
    }).addTo(overlay);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")