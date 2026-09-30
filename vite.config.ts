import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  server: {
    proxy: {
      // Proxy /api/* to the Vercel dev server running on port 3000
      // Run `vercel dev` in a separate terminal so serverless functions are served.
      // Alternatively these can be tested directly on deployed Vercel preview.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
