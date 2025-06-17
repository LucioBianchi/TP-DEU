import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { balnearios } from "../../data/balnearios";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  return (
    <MapContainer center={[-34.6037, -58.3816]} zoom={13} style={{ height: "100vh", width: "100%" }} aria-label="Mapa de balnearios">
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {balnearios.map(b => (
        <Marker key={b.id} position={[b.lat, b.lng]}>
          <Popup>
            <strong>{b.nombre}</strong><br />
            Agua: {b.agua}<br />
            Arena: {b.arena}<br />
            {b.descripcion}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}