
const ipAddressTrackerData = {
  ip: "",
  location: "",
  isp: "",
  timeZone: "",
};


const apiKey = "at_i9lnCTa3tBhkXL3Joa8ysmpsqnEoK";

let map;
const defaultLat = 51.5074;
const defaultLng = -0.1278;
initializeMap(defaultLat, defaultLng);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      initializeMap(userLat, userLng);
    },
    (error) => {
      console.error("Error getting geolocation:", error);
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
}

let ipElement = document.getElementById("ip");
let locationElement = document.getElementById("location");
let timeElement = document.getElementById("time");
let ispElement = document.getElementById("isp");

function handleBtnClicked() {
  console.log(apiKey);
  let inputElement = document.getElementById("input").value;
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${inputElement}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      ipAddressTrackerData.ip = data.ip;
      ipAddressTrackerData.location = `${data.location.city} ${data.location.region}, ${data.location.country}`;
      ipAddressTrackerData.isp = data.isp;
      ipAddressTrackerData.timeZone = data.location.timezone;
      updateMap(data.location.lat, data.location.lng);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

document.getElementById("button").addEventListener("click", handleBtnClicked);

function initializeMap(lat, lng) {
  map = L.map("map").setView([lat, lng], 10);

  // Add a tile layer using OpenStreetMap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy mohammed belfellah 2023",
  }).addTo(map);

  var customIcon = L.divIcon({
    className: "custom-div-icon",
    html: '<img src="../images/icon-location.svg" alt="Custom Icon" width="32" height="32">',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  L.marker([lat, lng], {
    icon: customIcon,
  }).addTo(map);
}

function updateMap(lat, lng) {
  ipElement.innerText = ipAddressTrackerData.ip;
  locationElement.innerText = ipAddressTrackerData.location;
  timeElement.innerText = ipAddressTrackerData.timeZone;
  ispElement.innerText = ipAddressTrackerData.isp;

  if (map) {
    map.setView([lat, lng], 10);

    var customIcon = L.divIcon({
      className: "custom-div-icon",
      html: '<img src="../images/icon-location.svg" alt="Custom Icon" width="32" height="32">',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add a marker with the updated coordinates
    L.marker([lat, lng], {
      icon: customIcon,
    }).addTo(map);
  }
}
