const { propertyOrdering, selectorOrdering } = require('stylelint-semantic-groups');

module.exports = {
  overrides: [
    {
      files: [ '**/*.scss' ]
    }
  ],
  extends: [
    'stylelint-config-standard-scss'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
    'stylelint-use-logical'
  ],
  rules: {
    'declaration-block-no-duplicate-properties': [ true, {
      ignore: [ 'consecutive-duplicates-with-different-values' ]
    } ],
    'order/order': selectorOrdering,
    'order/properties-order': propertyOrdering,
    'color-no-invalid-hex': true,
    'declaration-empty-line-before': [ null, { 'severity': 'warning' } ],
    // 'string-quotes': 'single',
    'selector-class-pattern': [ null, { 'severity': 'warning' } ],
    'selector-pseudo-element-no-unknown': [ true, { 'ignorePseudoElements': [ 'ng-deep' ] } ],
    'color-hex-length': 'long',
    'csstools/use-logical': [
      true,
      {
        'except': [
          // not important for RTL support
          'width',
          'height',
          'min-width',
          'min-height',
          'max-width',
          'max-height'
          /**
           * might need to eventually add this as well, since it's used in a lot of places and
           * would not affect RTL support anyway. This goes for both top and bottom.
           **/
          // 'top',
          // 'bottom'
        ]
      }
    ]
  }
};