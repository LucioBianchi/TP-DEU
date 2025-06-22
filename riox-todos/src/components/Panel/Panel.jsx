import React from "react";
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

export default function Panel({ currentPage, filters, onFiltersChange }) {
  const pageConfig = getPageConfig(currentPage);
  
  // Si la página no requiere panel, no renderizar nada
  if (!pageConfig.requiresPanel) {
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
      onFiltersChange
    },
    [PAGES.INFO]: {},
    [PAGES.USUARIO]: {},
    [PAGES.CONFIG]: {}
  };

  return (
    <aside
      className="panel-overlay"
      role="region"
      aria-label={`Panel de ${pageConfig.label}`}
      tabIndex={-1}
    >
      <PanelComponent {...panelProps[currentPage]} />
    </aside>
  );
}