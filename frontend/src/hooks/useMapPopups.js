import { useState, useEffect, useRef } from "react";

// Hook para manejar el estado y lógica de los popups del mapa
export const useMapPopups = () => {
  const [openPopupId, setOpenPopupId] = useState(null);
  const popupRefs = useRef({});

  // Manejar Escape para cerrar popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openPopupId) {
        e.preventDefault();
        setOpenPopupId(null);
        // Cerrar todos los popups de Leaflet
        const popups = document.querySelectorAll('.leaflet-popup');
        popups.forEach(popup => {
          if (popup._leaflet_id) {
            popup._leaflet_map.closePopup();
          }
        });
      }
    };

    if (openPopupId) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [openPopupId]);

  // Asegurar que los marcadores sean accesibles por teclado
  useEffect(() => {
    // Solo el marker activo debe ser focuseable
    const containers = document.querySelectorAll('.leaflet-marker-icon.custom-marker-container');
    containers.forEach(container => {
      const marker = container.querySelector('.custom-marker');
      if (openPopupId) {
        if (marker && marker.getAttribute('aria-label')?.includes(openPopupId)) {
          container.setAttribute('tabindex', '0');
        } else {
          container.setAttribute('tabindex', '-1');
        }
      } else {
        container.setAttribute('tabindex', '0');
      }
    });
  }, [openPopupId]);

  // Manejo de focus trap en popups
  useEffect(() => {
    if (!openPopupId) return;

    const popup = document.querySelector('.leaflet-popup[aria-label]');
    if (!popup) return;
    
    const focusable = popup.querySelectorAll('[tabindex="0"], a, button, input, select, textarea');
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTrap(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    popup.addEventListener('keydown', handleTrap);
    return () => popup.removeEventListener('keydown', handleTrap);
  }, [openPopupId]);

  return {
    openPopupId,
    setOpenPopupId,
    popupRefs
  };
};