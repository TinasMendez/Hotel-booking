// frontend/.eslintrc.cjs
module.exports = {
    root: true,
    env: { browser: true, es2021: true, node: true },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "detect" } },
    plugins: ["react", "react-hooks", "import"],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "import/order": [
        "warn",
        {
            "newlines-between": "always",
            "alphabetize": { order: "asc", caseInsensitive: true },
            "groups": ["builtin", "external", "internal", "parent", "sibling", "index"]
        }
        ],
        // Keep code clean but do not fail CI for minor issues
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
        "no-empty": "warn"
    },
    overrides: [
        {
        files: ["**/*.test.{js,jsx}", "**/__tests__/*.{js,jsx}"],
        env: { browser: true, node: true },
        globals: {
            vi: "readonly",
            test: "readonly",
            expect: "readonly"
        },
        rules: {
            // Tests often need dev-only imports or unused helpers
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }]
        }
        }
    ],
    ignorePatterns: ["dist/", "node_modules/"]
    };
