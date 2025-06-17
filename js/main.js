import { Router } from './router.js';
import { renderMap, centrarEnUbicacion } from './map.js';
import { renderFilter } from './filters.js';
import { renderHelp } from './help.js';
import { renderUser } from './user.js';
import { renderConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  Router.register("map", renderMap);
  Router.register("filter", renderFilter);
  Router.register("help", renderHelp);
  Router.register("user", renderUser);
  Router.register("config", renderConfig);

  document.getElementById("btnMapa").addEventListener("click", () => Router.navigate("map"));
  document.getElementById("btnFiltro").addEventListener("click", () => Router.navigate("filter"));
  document.getElementById("btnAyuda").addEventListener("click", () => Router.navigate("help"));
  document.getElementById("btnUsuario").addEventListener("click", () => Router.navigate("user"));
  document.getElementById("btnConfig").addEventListener("click", () => Router.navigate("config"));
  document.getElementById("btnGeo").addEventListener("click", () => {
    centrarEnUbicacion();
  });

  Router.navigate("map");
});
