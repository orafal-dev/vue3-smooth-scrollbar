import { copyFileSync } from "node:fs"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

const stylesEntry = fileURLToPath(new URL("./src/styles.css", import.meta.url))
const stylesOutput = fileURLToPath(
  new URL("./dist/styles.css", import.meta.url),
)

export default defineConfig(({ command }) => {
  const isServe = command === "serve"

  return {
    plugins: [
      vue(),
      ...(!isServe
        ? [
            dts({
              include: ["src/**/*.ts", "src/**/*.vue"],
              exclude: ["src/main.ts", "src/App.vue", "src/styles.css"],
              outDir: "dist",
              rollupTypes: false,
              copyDtsFiles: true,
            }),
            {
              name: "copy-styles",
              closeBundle() {
                copyFileSync(stylesEntry, stylesOutput)
              },
            },
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: isServe
      ? undefined
      : {
          lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            name: "Vue3SmoothScrollbar",
            fileName: "vue3-smooth-scrollbar",
          },
          rollupOptions: {
            external: ["vue", "smooth-scrollbar"],
            output: {
              assetFileNames: "vue3-smooth-scrollbar.[ext]",
              globals: {
                vue: "Vue",
                "smooth-scrollbar": "SmoothScrollbar",
              },
            },
          },
        },
  }
})
