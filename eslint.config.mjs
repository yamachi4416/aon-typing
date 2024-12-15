import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPromise from 'eslint-plugin-promise'

export default createConfigForNuxt({})
  .prepend({
    plugins: [eslintPluginPromise],
  })
  .append(eslintConfigPrettier)
  .overrideRules({
    'no-console': 'off',
    'no-lone-blocks': 'off',
    'vue/multi-word-component-names': 'off',
    'import/order': 'off',
  })
