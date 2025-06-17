import React, { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [fontSize, setFontSize] = useState("medium");
  const [iconSize, setIconSize] = useState("medium");

  useEffect(() => {
  // Cambia el tamaño de fuente global
  document.documentElement.style.setProperty(
    "--font-size",
    fontSize === "small" ? "14px" : fontSize === "large" ? "20px" : "16px"
  );
  // Cambia el tamaño de iconos global
  document.documentElement.style.setProperty(
    "--icon-size",
    iconSize === "small" ? "20px" : iconSize === "large" ? "32px" : "24px"
  );
}, [fontSize, iconSize]);

  return (
    <ConfigContext.Provider value={{ fontSize, setFontSize, iconSize, setIconSize }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}