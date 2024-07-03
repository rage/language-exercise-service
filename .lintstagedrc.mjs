// Prettier and eslint
export default {
  "*.{js,jsx,ts,tsx}": ["prettier --write --semi false", "eslint --fix"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
}
