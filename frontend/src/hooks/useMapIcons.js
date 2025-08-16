import { useMemo } from "react";
import L from "leaflet";
import { useConfig } from "../context/ConfigContext";

// Arreglar el problema de los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mapear tamaño de configuración a dimensiones reales
const ICON_SIZES = {
  small: { width: 20, height: 30, iconSize: [20, 30], iconAnchor: [10, 30], popupAnchor: [0, -30] },
  medium: { width: 24, height: 36, iconSize: [24, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] },
  large: { width: 32, height: 48, iconSize: [32, 48], iconAnchor: [16, 48], popupAnchor: [0, -48] }
};

// Función para obtener el color según el nivel de contaminación
export const getContaminationColor = (nivel) => {
  switch (nivel) {
    case "Bajo":
      return "#28a745";
    case "Medio":
      return "#ffc107";
    case "Alto":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

// Función para obtener el texto descriptivo
export const getContaminationText = (nivel) => {
  switch (nivel) {
    case "Bajo":
      return "Contaminación baja - Seguro para uso recreativo";
    case "Medio":
      return "Contaminación media - Precaución recomendada";
    case "Alto":
      return "Contaminación alta - No recomendado para uso recreativo";
    default:
      return "Información no disponible";
  }
};

// Crear icono personalizado con tamaño dinámico
const createCustomIcon = (color = "#007bff", balnearioName = "", aguaLevel = "", arenaLevel = "", iconSize = "medium") => {
  const size = ICON_SIZES[iconSize] || ICON_SIZES.medium;
  
  const getContaminationDescription = (agua, arena) => {
    const aguaText = agua === "Alto" ? "contaminación alta" : agua === "Medio" ? "contaminación media" : "contaminación baja";
    const arenaText = arena === "Alto" ? "contaminación alta" : arena === "Medio" ? "contaminación media" : "contaminación baja";
    return `Agua: ${aguaText}, Arena: ${arenaText}`;
  };

  const getAccessibilityLevel = (agua, arena) => {
    if (agua === "Alto" || arena === "Alto") {
      return "No recomendado para uso recreativo";
    } else if (agua === "Medio" || arena === "Medio") {
      return "Precaución recomendada";
    } else {
      return "Seguro para uso recreativo";
    }
  };

  return L.divIcon({
    html: `
      <div 
        class="custom-marker"
        data-size="${iconSize}"
        aria-label="Balneario ${balnearioName}. ${getContaminationDescription(aguaLevel, arenaLevel)}. ${getAccessibilityLevel(aguaLevel, arenaLevel)}. Presiona Enter o Espacio para ver información detallada"
        style="cursor: pointer; outline: none;"
      >
        <svg width="${size.width}" height="${size.height}" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 24 12 24s12-15.5 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
      </div>
    `,
    className: "custom-marker-container",
    iconSize: size.iconSize,
    iconAnchor: size.iconAnchor,
    popupAnchor: size.popupAnchor
  });
};

// Hook principal para manejar iconos del mapa
export const useMapIcons = (balnearios) => {
  const { config } = useConfig();

  // Memoizar los iconos para que se actualicen cuando cambie config.iconSize
  const iconCache = useMemo(() => {
    const cache = {};
    balnearios.forEach(b => {
      const key = `${b.id}-${config.iconSize}`;
      cache[key] = createCustomIcon(
        getContaminationColor(b.agua),
        b.nombre,
        b.agua,
        b.arena,
        config.iconSize
      );
    });
    return cache;
  }, [balnearios, config.iconSize]);

  return {
    iconCache,
    currentIconSize: config.iconSize
  };
};