let map;
export function renderMap() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Mapa de balnearios</h2>
    <div id="map" style="height: 500px;"></div>
    <div id="balnearioInfo" class="mt-3" aria-live="polite"></div>
  `;

  map = L.map('map').setView([-34.61, -58.38], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([-34.6157, -58.4356]).addTo(map)
    .bindPopup('Balneario Sur - Contaminación Alta');
}

export function centrarEnUbicacion() {
  if (!map) {
    alert("El mapa no está inicializado todavía.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 14);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup("Estás aquí").openPopup();
  }, () => {
    alert("No se pudo obtener la ubicación.");
  });
}
