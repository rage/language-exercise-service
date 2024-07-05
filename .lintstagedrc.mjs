// Prettier and eslint
export default {
  "*.{js,jsx,ts,tsx}": [
    "npx prettier --write --semi false",
    "npx eslint --fix",
  ],
  "*.{json,md,yml,yaml}": ["npx prettier --write"],
}
