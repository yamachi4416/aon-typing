import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintPluginCompat from 'eslint-plugin-compat'
import eslintPluginPromise from 'eslint-plugin-promise'

export default createConfigForNuxt({
  features: {
    formatters: true,
    import: {
      package: 'eslint-plugin-import-lite',
    },
    stylistic: {
      arrowParens: true,
      braceStyle: '1tbs',
    },
  },
})
  .prepend(eslintPluginPromise.configs['flat/recommended'], {
    ...eslintPluginCompat.configs['flat/recommended'],
    ignores: ['./test/**/*', './scripts/**/*'],
    settings: {
      polyfills: ['es:all'],
    },
  })
  .overrideRules({
    '@stylistic/generator-star-spacing': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
      },
    ],
    'vue/html-self-closing': 'off',
  })
