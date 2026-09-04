import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships flat configs directly, so they are spread in
 * as-is. The previous FlatCompat wrapper is gone along with its
 * @eslint/eslintrc dependency — compat mode cannot serialise the new config
 * and fails with a circular-structure error.
 */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
