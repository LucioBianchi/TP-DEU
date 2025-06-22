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
    <div className="app-root">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      
      <MapView filters={filters} />
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigateTo}
      />
      <Panel
        currentPage={currentPage}
        filters={filters}
        onFiltersChange={updateFilters}
        onResetFilters={resetFilters}
        onClose={closePanel}
      />
      
      <main id="main-content" tabIndex={-1}>
        {/* El mapa es el contenido principal */}
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