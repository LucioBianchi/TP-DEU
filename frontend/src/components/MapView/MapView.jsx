import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useBalnearios } from "../../hooks/useBalnearios";
import { useMapIcons } from "../../hooks/useMapIcons";
import { useMapPopups } from "../../hooks/useMapPopups";
import BalnearioPopUp from "./BalnearioPopUp";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// Configuración del mapa
const MAP_CONFIG = {
  center: [-34.6037, -58.3816],
  zoom: 13,
  tileLayer: {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }
};

export default function MapView({ filters }) {
  const { balnearios } = useBalnearios(filters);
  const { iconCache, currentIconSize } = useMapIcons(balnearios);
  const { openPopupId, setOpenPopupId, popupRefs } = useMapPopups();

  const handlePopupOpen = (balnearioId) => {
    setOpenPopupId(balnearioId);
    setTimeout(() => {
      if (popupRefs.current[balnearioId]) {
        popupRefs.current[balnearioId].focus();
      }
    }, 0);
  };

  const handlePopupClose = () => {
    setOpenPopupId(null);
  };

  return (
    <section 
      aria-label="Mapa interactivo de balnearios del Río de la Plata"
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      <MapContainer 
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={{ height: "100vh", width: "100%" }} 
        aria-label="Mapa de balnearios"
      >
        <TileLayer
          attribution={MAP_CONFIG.tileLayer.attribution}
          url={MAP_CONFIG.tileLayer.url}
        />
        
        {balnearios.map(b => {
          const iconKey = `${b.id}-${currentIconSize}`;
          return (
            <Marker 
              key={iconKey}
              position={[b.latitude, b.longitude]}
              icon={iconCache[iconKey]}
              eventHandlers={{
                // El marker solo abre el popup si se hace click o enter/espacio en el botón, no directamente en el marker
              }}
            >
              <Popup
                onOpen={() => handlePopupOpen(b.id)}
                onClose={handlePopupClose}
                aria-label={`Información detallada de ${b.nombre}`}
                autoPan={true}
                autoFocus={false}
              >
                <BalnearioPopUp 
                  balneario={b}
                  onOpen={() => handlePopupOpen(b.id)}
                  onClose={handlePopupClose}
                  popupRefs={popupRefs}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
}