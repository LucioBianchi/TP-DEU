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
    updateFilters
  } = useAppState();

  return (
    <div className="app-root">
      <MapView filters={filters} />
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigateTo}
      >
        <Panel
          currentPage={currentPage}
          filters={filters}
          onFiltersChange={updateFilters}
        />
      </Sidebar>
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