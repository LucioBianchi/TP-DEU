export const PAGES = {
  FILTROS: 'filtros', 
  INFO: 'info',
  USUARIO: 'usuario',
  CONFIG: 'config'
};

export const PAGE_CONFIG = {
  [PAGES.FILTROS]: {
    id: PAGES.FILTROS,
    label: 'Filtros',
    icon: '🔍', 
    description: 'Filtrar balnearios',
    requiresPanel: true
  },
  [PAGES.INFO]: {
    id: PAGES.INFO,
    label: 'Información',
    icon: 'ℹ️',
    description: 'Información sobre balnearios',
    requiresPanel: true
  },
  [PAGES.USUARIO]: {
    id: PAGES.USUARIO,
    label: 'Usuario',
    icon: '👤',
    description: 'Perfil de usuario',
    requiresPanel: true
  },
  [PAGES.CONFIG]: {
    id: PAGES.CONFIG,
    label: 'Configuración',
    icon: '⚙️',
    description: 'Configuración de accesibilidad',
    requiresPanel: true
  }
};

export const getPageConfig = (pageId) => PAGE_CONFIG[pageId] || null;

export const getAllPages = () => Object.values(PAGE_CONFIG); 