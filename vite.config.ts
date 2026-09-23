import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Para publicar em usuario.github.io, mantenha "/".
  // Para um repositorio de projeto, use "/nome-do-repositorio/".
  base: "/",
});
