module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 100, // 基于750px设计稿，1rem = 100px
      propList: ['*'],
      selectorBlackList: ['.ignore-rem', '.hairlines'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i
    }
  }
}
