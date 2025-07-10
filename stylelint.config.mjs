/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-browser-compat'],
  rules: {
    'scss/at-mixin-pattern': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'plugin/browser-compat': [
      true,
      {
        allow: {
          features: ['at-rules.supports', 'at-rules.page', 'properties.resize'],
          flagged: false,
          partialImplementation: false,
          prefix: true,
        },
      },
    ],
  },
}
