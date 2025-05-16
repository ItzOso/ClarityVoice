// /Users/oscar/Development/clarity-voice/functions/.eslintrc.js
export default {
  // This is the correct syntax for .eslintrc.js in a "type": "module" project
  root: true, // IMPORTANT: Prevents ESLint from searching for configuration files in parent directories.
  env: {
    node: true, // Defines Node.js global variables (like process, Buffer) and Node.js scoping.
    es2020: true, // Or your project's target ECMAScript version (e.g., es2021, es2022).
  },
  parserOptions: {
    ecmaVersion: 2020, // Or your project's target ECMAScript version.
    sourceType: "module", // Confirms your .js files (like index.js) are ES modules.
  },
  extends: [
    "eslint:recommended", // Basic ESLint recommendations.
    // "google",          // Temporarily COMMENT THIS OUT. The "google" config is extensive and might be overriding something. Let's test without it first.
  ],
  rules: {
    // Your existing rules can stay here.
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],

    // You can add a simple test rule if you want to be 100% sure this file is being read:
    // For example, if you have console.log() in index.js, this would cause an ESLint error:
    // "no-console": "error",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
