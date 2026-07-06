// client/eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  // ✅ Next.js Core Web Vitals Rules
  ...nextVitals,
  
  // ✅ Global Ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "dist/**",
    "public/**",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    ".eslintrc.js",
    ".eslintrc.json",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    // ✅ Next.js 16 এর জন্য নতুন ignores
    ".turbo/**",
    "coverage/**",
    ".vercel/**",
    ".env*.local",
  ]),
  
  // ✅ Custom Rules
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      // ============ Accessibility ============
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      
      // ============ Next.js Specific ============
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-document-import-in-page": "off",
      "@next/next/no-script-in-document": "off",
      
      // ============ React Hooks ============
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      
      // ============ React Specific ============
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/self-closing-comp": "warn",
      
      // ============ Import/Export ============
      "import/no-anonymous-default-export": "off",
      "import/named": "off",
      
      // ============ Variables ============
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      "prefer-const": "warn",
      
      // ============ Styling ============
      "quotes": ["warn", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
      "semi": ["warn", "always"],
      "comma-dangle": ["warn", "always-multiline"],
      
      // ============ Console ============
      "no-console": ["warn", { "allow": ["warn", "error", "info", "debug"] }],
      "no-debugger": "error",
      
      // ============ Other ============
      "no-multiple-empty-lines": ["warn", { "max": 2, "maxEOF": 1 }],
      "no-useless-escape": "warn",
      "prefer-template": "warn",
      "object-shorthand": "warn",
      "prefer-arrow-callback": "warn",
    },
  },
  
  // ✅ Test files
  {
    files: ["**/*.test.js", "**/*.test.jsx", "**/*.spec.js", "**/*.spec.jsx"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
  
  // ✅ Next.js pages
  {
    files: ["src/app/**/page.jsx", "src/app/**/page.js", "src/app/**/page.tsx", "src/app/**/page.ts"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
  
  // ✅ API routes
  {
    files: ["src/app/api/**/*.js", "src/app/api/**/*.jsx", "src/app/api/**/*.ts", "src/app/api/**/*.tsx"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;