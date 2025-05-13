import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
  },
  {
    rules: {
      'regexp/no-unused-capturing-group': 'off',
      'regexp/strict': 'off',
      'ts/no-unused-expressions': 'off',
    },
  },
)
