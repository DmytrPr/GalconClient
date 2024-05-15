module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:tailwind/recommended',
    'plugin:storybook/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    extraFileExtensions: ['.scss'],
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['react', 'i18next'],
  ignorePatterns: ['index.html'],
  rules: {
    // TYPESCRIPT ESLINT RULES
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-loop-func': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': false }],
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-unsafe-optional-chaining': 'warn',
    // REACT RULES
    'react/jsx-wrap-multilines': [
      'error',
      {
        arrow: true,
        return: true,
        declaration: true,
      },
    ],
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-no-useless-fragment': 'off',
    'react/no-unused-prop-types': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-no-bind': 'off',
    // JSX-A11Y RULES
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    // IMPORT RULES
    'import/extensions': [0],
    'import/no-unresolved': [0],
    'import/no-cycle': 'warn',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'warn',
    // CYPRESS RULES
    'cypress/no-unnecessary-waiting': 'off',
    // ESLINT RULES
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'max-len': [
      'error',
      {
        code: 100,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
    'prefer-const': 2,
    'no-var': 2,
    'object-shorthand': 2,
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
          multiline: true,
        },
        ObjectPattern: {
          consistent: true,
          multiline: true,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      },
    ],
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'react/function-component-definition': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'function-paren-newline': 'off',
    'no-restricted-exports': 'off',
    'implicit-arrow-linebreak': 'off',
    indent: 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'brace-style': 'off',
    'linebreak-style': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {
        name: 'Link',
        linkAttribute: 'to',
      },
    ],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['src/**/*.spec.{ts,tsx}'],
      plugins: ['jest'],
      extends: ['eslint:recommended', 'plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
      env: {
        'jest/globals': true,
      },
    },
    {
      files: ['src/**/*.test.{ts,tsx}'],
      plugins: ['cypress'],
      extends: ['plugin:cypress/recommended'],
      env: {
        'cypress/globals': true,
      },
    },
  ],
};
