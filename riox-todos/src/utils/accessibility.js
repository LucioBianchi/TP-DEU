// Utilidades para accesibilidad

export const announceToScreenReader = (message) => {
  // Crear un elemento temporal para anuncios
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remover después de un breve delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const focusElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
};

export const trapFocus = (containerRef) => {
  const focusableElements = containerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (!focusableElements || focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  
  containerRef.current?.addEventListener('keydown', handleKeyDown);
  
  return () => {
    containerRef.current?.removeEventListener('keydown', handleKeyDown);
  };
};

export const getContrastRatio = (color1, color2) => {
  // Función simplificada para calcular ratio de contraste
  // En una implementación real, usarías una librería como color-contrast
  return 4.5; // Valor placeholder
};

export const isHighContrastMode = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

export const isReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}; 