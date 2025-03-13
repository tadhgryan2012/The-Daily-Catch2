import React, { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    let map, autocomplete, infoWindow;
    let markers = [];

    window.initMap = async function () {
      let center = await getUserLocation();
      if (!center) center = { lat: 52.6739, lng: -8.5755 };

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
        center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
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

      fetchMarkersFromLocalStorage();

      map.addListener("click", (event) => {
        infoWindow.close();
        const title = prompt("Enter a name for this location:");
        if (title) {
          addMarker(event.latLng, title);
          saveMarker(event.latLng, title);
        }
      });

      map.addListener("drag", () => {
        infoWindow.close();
      });

    };

    function addMarker(position, title) {
      const marker = new google.maps.Marker({
        position,
        map,
        title,
      });
      markers.push(marker);

      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="text-align: center;">
            <h3>${title}</h3>
            <button onclick="window.location.href='/threads/${title}'">
              View Thread
            </button>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    }

    function saveMarker(position, title) {
      let markers = JSON.parse(localStorage.getItem("markers")) || [];
      markers.push({ position, title });
      
      localStorage.setItem("markers", JSON.stringify(markers));
    }

    function fetchMarkersFromLocalStorage() {
      let markers = JSON.parse(localStorage.getItem("markers")) || [];
      markers.forEach(marker => {
        addMarker(marker.position, marker.title);
      });
    }

    function getUserLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => resolve(null)
          );
        } else {
          resolve(null);
        }
      });
    }

    if (!document.getElementById("google-maps")) {
      const script = document.createElement("script");
      script.id = "google-maps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places&loading=async&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.google) {
      window.initMap();
    }
    
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%"}}>
      <div className="position-absolute top-0 start-10 m-3 p-2 bg-white shadow rounded z-3">
        <input id="searchBox" className="form-control" type="text" placeholder="Search for a place" />
      </div>
      <div id="map" className="w-100 h-100 position-relative"></div>
    </div>
  );
};

export default Map;
