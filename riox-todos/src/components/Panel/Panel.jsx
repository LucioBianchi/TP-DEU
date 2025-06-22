import React, { useEffect } from "react";
import { getPageConfig, PAGES } from "../../config/pages";
import FiltersPanel from "./FiltersPanel/FiltersPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import UserPanel from "./UserPanel/UserPanel";
import ConfigPanel from "./ConfigPanel/ConfigPanel";

const PANEL_COMPONENTS = {
  [PAGES.FILTROS]: FiltersPanel,
  [PAGES.INFO]: InfoPanel,
  [PAGES.USUARIO]: UserPanel,
  [PAGES.CONFIG]: ConfigPanel
};

export default function Panel({ currentPage, filters, onFiltersChange, onResetFilters, onClose }) {
  const pageConfig = getPageConfig(currentPage);
  
  // Solo manejar Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Si no hay página seleccionada, no renderizar nada
  if (!currentPage || !pageConfig) {
    return null;
  }

  const PanelComponent = PANEL_COMPONENTS[currentPage];
  
  if (!PanelComponent) {
    return null;
  }

  // Props específicas para cada tipo de panel
  const panelProps = {
    [PAGES.FILTROS]: {
      filters,
      onFiltersChange,
      onResetFilters
    },
    [PAGES.INFO]: {},
    [PAGES.USUARIO]: {},
    [PAGES.CONFIG]: {}
  };

  return (
    <aside
      className="panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      aria-describedby="panel-description"
    >
      <div className="panel-header">
        <h2 id="panel-title" className="panel-title">{pageConfig.label}</h2>
        <button
          className="panel-close-btn"
          onClick={onClose}
          aria-label={`Cerrar panel de ${pageConfig.label}`}
          title="Cerrar (Escape)"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
      
      <div id="panel-description" className="panel-content">
        <PanelComponent {...panelProps[currentPage]} />
      </div>
    </aside>
  );
}