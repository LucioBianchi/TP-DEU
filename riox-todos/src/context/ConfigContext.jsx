import React, { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

const defaultConfig = {
  fontSize: "medium",
  iconSize: "medium", 
  fontFamily: "default",
  reducedMotion: false
};

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  useEffect(() => {
    // Aplicar configuraciones de accesibilidad al DOM
    const root = document.documentElement;
    
    // Tamaño de fuente
    const fontSizeMap = {
      small: "14px",
      medium: "16px", 
      large: "20px"
    };
    root.style.setProperty("--font-size", fontSizeMap[config.fontSize] || "16px");
    
    // Tamaño de iconos
    const iconSizeMap = {
      small: "20px",
      medium: "24px",
      large: "32px"
    };
    root.style.setProperty("--icon-size", iconSizeMap[config.iconSize] || "24px");
    
    // Familia de fuente
    const fontFamilyMap = {
      default: "system-ui, -apple-system, sans-serif",
      dyslexic: "OpenDyslexic, Arial, sans-serif",
      serif: "Georgia, serif",
      monospace: "Courier New, monospace"
    };
    root.style.setProperty("--font-family", fontFamilyMap[config.fontFamily] || "system-ui");
    
    // Movimiento reducido
    root.classList.toggle("reduced-motion", config.reducedMotion);
    
  }, [config]);

  const value = {
    config,
    updateConfig,
    resetConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}