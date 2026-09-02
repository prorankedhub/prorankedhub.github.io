import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Organization root page (prorankedhub.github.io repo), so it's served
// from the domain root — no repo-name base path needed.
export default defineConfig({
  base: "/",
  plugins: [react()],
});
