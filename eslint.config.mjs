import reduxSaga from "eslint-plugin-redux-saga";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
//import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("airbnb"),
    {
        ignores: [".gitignore"],
        plugins: {
            "redux-saga": reduxSaga,
            react,
            "jsx-a11y": jsxA11Y,
            "import": importPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },

            parser: babelParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },

                requireConfigFile: false,

                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        },

        settings: {
            "import/resolver": {
                webpack: {
                    config: "./internals/webpack/webpack.prod.babel.js",
                },
            },
            "react": {
                "version": "detect"
            }
        },

        rules: {
            "arrow-parens": ["error", "always"],
            "arrow-body-style": [2, "as-needed"],
            "camelcase": 0,
            "comma-dangle": ["error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "only-multiline",
            }],
            "import/imports-first": 0,
            "import/newline-after-import": 0,
            "import/no-dynamic-require": 0,
            "import/no-extraneous-dependencies": 0,
            "import/no-named-as-default": 0,
            "import/no-unresolved": 2,
            "import/prefer-default-export": 0,

            "indent": [2, 2, {
                "SwitchCase": 1,
            }],

            "jsx-a11y/aria-props": 2,
            "jsx-a11y/heading-has-content": 0,
            "jsx-a11y/label-has-for": 2,
            "jsx-a11y/mouse-events-have-key-events": 2,
            "jsx-a11y/role-has-required-aria-props": 2,
            "jsx-a11y/role-supports-aria-props": 2,
            "max-len": 0,
            "newline-per-chained-call": 0,
            "no-confusing-arrow": 0,
            "no-console": 1,
            "no-use-before-define": 0,

            "no-unused-vars": "error",

            "prefer-template": 2,
            "class-methods-use-this": 0,
            "react/forbid-prop-types": 0,
            "react/jsx-first-prop-new-line": [2, "multiline"],
            "react/jsx-filename-extension": 0,
            "react/jsx-no-target-blank": 0,

            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",

            "react/no-array-index-key": 0,
            "react/require-default-props": 0,
            "react/require-extension": 0,
            "react/destructuring-assignment": 0,
            "react/self-closing-comp": 0,
            "react/sort-comp": 0,
            "redux-saga/no-yield-in-race": 2,
            "redux-saga/yield-effects": 2,
            "require-yield": 0,
            "import/no-webpack-loader-syntax": 0,

            //from airbnb extends disabled configs - WIP
            "function-paren-newline": 0,
            "import/no-named-as-default-member": 0,
            "import/named": 0,
            "no-multiple-empty-lines": 0,
            "default-param-last": 0,
            "react/jsx-props-no-spreading": 0,
            "react/jsx-curly-newline": 0,
            "react/prop-types": 0,

        },
    }];