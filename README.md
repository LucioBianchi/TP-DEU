## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]

# Entrar al directorio
cd riox-todos

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## ♿ Accesibilidad

La aplicación está diseñada siguiendo las pautas WCAG 2.1:

- **Navegación por teclado** completa
- **ARIA labels** y roles apropiados
- **Contraste** configurable
- **Tamaño de fuente** ajustable
- **Skip links** para navegación rápida

## 📱 Funcionalidades

### Mapa
- Visualización de balnearios con marcadores
- Información detallada en popups
- Filtros por localidad

### Paneles
- **Filtros**: Filtrar balnearios por localidad
- **Info**: Información sobre el proyecto y metodología
- **Usuario**: Gestión de cuenta (preparado para Google Login)
- **Config**: Ajustes de accesibilidad

### Configuraciones
- Tamaño de fuente (pequeño, mediano, grande)
- Tamaño de iconos
- Familia de fuente (incluyendo fuentes para dislexia)
- Modo de alto contraste

## �� Diseño

- **Paleta de colores** accesible
- **Tipografía** clara y legible
- **Layout** responsive
- **Iconos** descriptivos

## 📊 Datos

Los datos de balnearios incluyen:
- Nombre y localidad
- Coordenadas geográficas
- Niveles de contaminación (agua y arena)
- Descripciones detalladas

## 🔧 Desarrollo

```bash
# Ejecutar tests
npm test

# Linting
npm run lint

# Build de desarrollo
npm run build:dev
```

**Nota**: Este proyecto es parte del trabajo práctico de la materia DUX.
