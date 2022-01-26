/* eslint-disable @typescript-eslint/no-var-requires */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      primaryLime: '#9EB934',
      lime: '#A4B64C',
      lime1: '#B6C56C',
      lime2: '#C8D38E',
      lime3: '#DAE1B3',
      lime4: '#EDF0D8',
      primaryNavy: '#0D2860',
      navy1: '#06173A',
      navy2: '#41547D',
      navy3: '#707E9D',
      navy4: '#A0A9BD',
      navy5: '#D0D4DE',
      grey: '#3B3A3C',
      grey1: '#626163',
      grey2: '#89898A',
      grey3: '#9C9C9C',
      grey4: '#B1B0B1',
      grey5: '#C4C4C4',
      grey6: '#D8D8D8',
      grey7: '#F1F1F1',
      fuschia: '#CC3E78',
      fuschia1: '#D45F92',
      fuschia2: '#DD85AD',
      fuschia3: '#E7ADC8',
      fuschia4: '#F2D6E3',
      teal: '#3E8E9F',
      teal1: '#56A4B2',
      teal2: '#7BBAC5',
      teal3: '#A5D2D8',
      teal4: '#D1E8EB',
      yellow: '#E8A842',
      yellow1: '#ECB960',
      yellow2: '#F0CA84',
      yellow3: '#F5DBAB',
      yellow4: '#FAEDD5',
      purple: '#643E85',
      purple1: '#83649D',
      purple2: '#A18AB6',
      purple3: '#C0B1CE',
      purple4: '#DFD8E7',
      red: '#FF0000',
      divider: '#DBDBDB',
    },
    ripple: theme => ({
      colors: theme('colors'),
    }),

    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        greenBottom: '0 6px 6px -3px #9EB934',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-ripple')(),
  ],
}
