import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginCompat from 'eslint-plugin-compat'
import eslintPluginPromise from 'eslint-plugin-promise'

export default createConfigForNuxt({})
  .prepend(eslintPluginPromise.configs['flat/recommended'], {
    ...eslintPluginCompat.configs['flat/recommended'],
    ignores: ['./test/**/*', './scripts/**/*'],
    settings: {
      polyfills: ['es:all'],
    },
  })
  .append(eslintConfigPrettier)
  .overrideRules({
    'no-console': 'off',
    'no-lone-blocks': 'off',
    'vue/multi-word-component-names': 'off',
    'import/order': 'off',
  })
