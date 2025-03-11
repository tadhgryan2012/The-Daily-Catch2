let map, autocomplete, infoWindow;
const markers = [];

async function initMap() {
  const center = await getUserLocation();
  if (! center) center = { lat: 52.673886649016126, lng: -8.575525004893134 };

  const styledMapType = new google.maps.StyledMapType(
    [
      { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9b2a6" }],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "geometry.stroke",
        stylers: [{ color: "#dcd2be" }],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#ae9e90" }],
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#93817c" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{ color: "#a5b076" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#447530" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#f5f1e6" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#fdfcf8" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#f8c967" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#e9bc62" }],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#e98d58" }],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry.stroke",
        stylers: [{ color: "#db8555" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#806b63" }],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8f7d77" }],
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ebe3cd" }],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#dfd2ae" }],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#b9d3c2" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#92998d" }],
      },
    ],
    { name: "Styled Map" },
  );

  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
    },
  });
  map.mapTypes.set("styled_map", styledMapType);
  map.setMapTypeId("styled_map");

  infoWindow = new google.maps.InfoWindow();

  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    autocomplete = new google.maps.places.Autocomplete(searchBox);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      if (!place.geometry) return;
      map.setCenter(place.geometry.location);
    });
  }

  fetch("/markers.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(marker => addMarker(marker.position, marker.title));
    });

  map.addListener("click", (event) => {
    infoWindow.close();
    const title = prompt("Enter a name for this location:");
    if (title) {
      addMarker(event.latLng, title);
      saveMarker(event.latLng, title);
    }
  });

  map.addListener("dragstart", () => {
    infoWindow.close();
  });

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    getUserLocation()
      .then((pos) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
      });
  });
};


// ================================================================================
// =============================== HELPER FUNCTIONS ===============================
// ================================================================================
function addMarker(position, title) {
  const marker = new google.maps.Marker({ 
    position, 
    map, 
    title,
  });
  markers.push(marker);

  marker.addListener("click", () => {
    infoWindow.setContent(`<div style="position: relative; background: white; padding: 10px; border-radius: 8px; text-align: center; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2); width: 120px; height: auto;"><div style="font-weight: bold; margin-bottom: 5px;"><h3>${title}</h3></div><button onclick="window.location.href='/threads/${title}'" style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">View Thread</button></div>`);
    infoWindow.open(map, marker);
  });
}

function saveMarker(position, title) {
  fetch("/maps/save-marker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position, title }),
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(pos);
        },
        (error) => reject(error)
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}


initMap()
