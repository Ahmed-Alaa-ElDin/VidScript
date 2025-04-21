// vite.config.js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: 'esnext',
        rollupOptions: {
            input: {
                content: resolve(__dirname, "src/content.js"),
                background: resolve(__dirname, "src/background.js"),
                popup: resolve(__dirname, "src/popup.html"),
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                // Copy manifest.json
                { src: "public/manifest.json", dest: "" },
                // Copy all icons
                { src: "public/icons/*", dest: "icons" },
                // Copy your extension CSS
                { src: "src/styles.css", dest: "" },
                // Copy utils
                { src: "src/utils/*", dest: "utils" },
            ],
        }),
    ],
});
