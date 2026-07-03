import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import eslintConfigPrettier from "@vue/eslint-config-prettier"
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript"
import globals from "globals"

export default defineConfigWithVueTs(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "no-debugger": "off",
      "vue/multi-word-component-names": "off",
    },
  },
)
