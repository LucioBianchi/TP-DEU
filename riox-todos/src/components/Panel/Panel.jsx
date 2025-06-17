import React from "react";
import FiltersPanel from "./FiltersPanel/FiltersPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import UserPanel from "./UserPanel/UserPanel";
import ConfigPanel from "./ConfigPanel/ConfigPanel";

export default function Panel({ selected, filtros, setFiltros }) {
  let content = null;
  switch (selected) {
    case "filtros":
      content = <FiltersPanel filtros={filtros} setFiltros={setFiltros} />;
      break;
    case "info":
      content = <InfoPanel />;
      break;
    case "usuario":
      content = <UserPanel />;
      break;
    case "config":
      content = <ConfigPanel />;
      break;
    default:
      content = null;
  }

  if (!content) return null;

  return (
    <aside
      className="panel-overlay"
      role="region"
      aria-label="Panel lateral"
      tabIndex={-1}
    >
      {content}
    </aside>
  );
}