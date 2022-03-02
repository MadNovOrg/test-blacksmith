import { alpha, createTheme } from '@mui/material'
import { ColorPartial } from '@mui/material/styles/createPalette'

import { LinkBehavior } from './components/LinkBehavior'

declare module '@mui/system' {
  interface Theme {
    colors: {
      navy: ColorPartial
      lime: ColorPartial
      teal: ColorPartial
      yellow: ColorPartial
      purple: ColorPartial
      fuschia: ColorPartial
    }
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      navy: ColorPartial
      lime: ColorPartial
      teal: ColorPartial
      yellow: ColorPartial
      purple: ColorPartial
      fuschia: ColorPartial
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    colors?: {
      navy?: ColorPartial
      lime?: ColorPartial
      teal?: ColorPartial
      yellow?: ColorPartial
      purple?: ColorPartial
      fuschia?: ColorPartial
    }
  }
  interface TypographyVariants {
    body3: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
  }
}

const theme = createTheme({
  colors: {
    navy: {
      50: '#ebf0fb',
      100: '#cfd4df',
      200: '#9ea9bf',
      300: '#6e7da0',
      400: '#3d5380',
      500: '#0D2860',
      600: '#0A204C',
      700: '#08193A',
      800: '#051128',
      900: '#020812',
    },
    lime: {
      50: '#fbffe7',
      100: '#ecf1d6',
      200: '#d8e3ae',
      300: '#c5d585',
      400: '#b1c75d',
      500: '#9EB934',
      600: '#7E9329',
      700: '#5F6F1F',
      800: '#414C15',
      900: '#1F240A',
    },
    teal: {
      50: '#e3fcff',
      100: '#cce9ec',
      200: '#9ad3d9',
      300: '#67bcc7',
      400: '#35a6b4',
      500: '#0290A1',
      600: '#027683',
      700: '#015660',
      800: '#013B41',
      900: '#001B1E',
    },
    yellow: {
      50: '#fff8eb',
      100: '#fcedd2',
      200: '#fadba5',
      300: '#f7ca7a',
      400: '#f5b84c',
      500: '#F2A61F',
      600: '#CF880C',
      700: '#9A6509',
      800: '#654206',
      900: '#352303',
    },
    purple: {
      50: '#fbf4ff',
      100: '#e1d7e8',
      200: '#c4b0d0',
      300: '#a688b9',
      400: '#8961a1',
      500: '#6B398A',
      600: '#572E70',
      700: '#402253',
      800: '#2A1636',
      900: '#160C1D',
    },
    fuschia: {
      50: '#fbf6ff',
      100: '#e1d7e8',
      200: '#c4b0d0',
      300: '#a688b9',
      400: '#e45494',
      500: '#DD2979',
      600: '#B41D61',
      700: '#881649',
      800: '#5C0F32',
      900: '#2C0718',
    },
  },
  palette: {
    primary: {
      main: '#9EB934',
    },
    error: {
      main: alpha('#FF0000', 0.6),
      light: alpha('#FF0000', 0.2),
      dark: alpha('#FF0000', 0.8),
    },
  },
})

const breakpoints = {
  values: {
    xs: 0,
    sm: 0,
    md: 768,
    lg: 1280,
    xl: 1920,
  },
}

export default createTheme({
  ...theme,
  breakpoints,
  typography: {
    fontFamily: ['Inter', 'sans-serif', 'Arial'].join(','),
    body2: {
      fontSize: '0.875rem',
      fontWeight: '400',
      [`@media screen and (max-width: ${breakpoints.values.lg}px)`]: {
        fontSize: '0.75rem',
      },
    },
    body3: {
      fontSize: '0.75rem',
      fontWeight: '400',
      [`@media screen and (max-width: ${breakpoints.values.lg}px)`]: {
        fontSize: '0.625rem',
      },
    },
    h2: {
      fontSize: '2.25rem',
      [`@media screen and (max-width: ${breakpoints.values.lg}px)`]: {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontSize: '1.125rem',
      [`@media screen and (max-width: ${breakpoints.values.lg}px)`]: {
        fontSize: '0.875rem',
      },
    },
    h4: {
      fontWeight: '300',
    },
    h5: {
      fontWeight: '300',
    },
    h6: {
      fontWeight: '300',
    },
    subtitle2: {
      fontWeight: '600',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            backgroundColor: theme.palette.common.white,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:nth-of-type(odd)': {
            backgroundColor: theme.palette.grey[100],
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
        color: 'inherit',
        // following line is from offical MUI docs but TS still complains
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        component: LinkBehavior,
      },
      styleOverrides: {
        root: {
          fontWeight: 'lighter',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
          backgroundColor: theme.palette.grey[100],

          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
            top: 0,
            height: '1px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 40,

          '&.Mui-selected': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
          },
        },
      },
    },
  },
})
