import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js"
import pluginReactHooks from "eslint-plugin-react-hooks"
import i18nextPlugin from "eslint-plugin-i18next"
import importPlugin from "eslint-plugin-import"

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ...pluginReactConfig, rules: { "react/react-in-jsx-scope": "off" } },
  {
    plugins: {
      i18next: i18nextPlugin,
      import: importPlugin,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "i18next/no-literal-string": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  { ignores: ["src/shared-module/", ".next"] },
]
