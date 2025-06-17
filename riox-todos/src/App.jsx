import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/MapView/MapView";
import Panel from "./components/Panel/Panel";

export default function App() {
  const [selected, setSelected] = useState("mapa");

  return (
    <div className="app-root">
      <MapView />
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected !== "mapa" && (
        <Panel selected={selected} setSelected={setSelected} />
      )}
    </div>
  );
}