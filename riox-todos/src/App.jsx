import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/MapView/MapView";
import Panel from "./components/Panel/Panel";
import { ConfigProvider } from "./context/ConfigContext.jsx";
import { useAppState } from "./hooks/useAppState";

function AppContent() {
  const { 
    currentPage, 
    filters,
    navigateTo, 
    closePanel,
    updateFilters,
    resetFilters
  } = useAppState();

  return (
    <div className="app-root" aria-label="Aplicación de Balnearios del Río de la Plata">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      
      <header className="app-header" role="banner">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={navigateTo}
        />
      </header>
      
      <main id="main-content" className="app-main" role="main" tabIndex={-1}>
        <aside className="panel-section" role="complementary" aria-label="Panel de información y controles">
          <Panel
            currentPage={currentPage}
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            onClose={closePanel}
          />
        </aside>
        
        <section 
          className="map-section" 
          aria-label="Mapa de balnearios"
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          <MapView filters={filters} />
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}