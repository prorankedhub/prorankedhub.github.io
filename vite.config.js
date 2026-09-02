import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Project page on GitHub Pages (not a custom domain / user.github.io repo),
// so asset URLs need the repo name as a base path.
export default defineConfig({
  base: "/pro-ranked-hub/",
  plugins: [react()],
});
