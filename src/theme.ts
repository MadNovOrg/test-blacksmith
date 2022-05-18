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

  interface Palette {
    green: Palette['primary']
  }

  interface PaletteOptions {
    tertiary: {
      main: string
    }
    green: PaletteOptions['primary']
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    tertiary: true
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
      main: '#0D2860',
    },
    secondary: {
      main: '#3B3A3C',
    },
    tertiary: {
      main: '#6B398A',
    },
    warning: {
      light: '#FFF8ED',
      main: '#F2A61F',
    },
    error: {
      main: alpha('#FF0000', 0.6),
      light: alpha('#FF0000', 0.2),
      dark: alpha('#FF0000', 0.8),
    },
    success: {
      main: '#9EB934',
      light: '#F0F4DD',
      dark: '#394700',
    },
    green: {
      main: '#59C13D',
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
    h1: {
      fontSize: '2rem',
      fontWeight: '700',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: '700',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },

    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: '600',
    },

    subtitle2: {
      fontSize: '1.25rem',
      fontWeight: '500',
    },

    body1: {
      fontSize: '1rem',
      fontWeight: '400',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: '400',
      color: '#6C6A6F',
    },
    button: {
      fontSize: '1rem',
      fontWeight: '500',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          position: 'static',
          boxShadow: 'none',
          border: 'none',
          background: 'transparent',
          borderBottom: '1px solid rgba(0, 0, 0, .12)',
        },
      },
    },
    MuiFormControlLabel: {
      defaultProps: {
        componentsProps: {
          typography: {
            variant: 'body1',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 0,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[100],
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
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.grey[500],
            height: '2px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: '10px',
          textTransform: 'none',

          '&.Mui-selected': {
            color: theme.palette.text.primary,
            fontWeight: 400,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        outlinedSuccess: {
          backgroundColor: theme.palette.success.light,
          borderColor: theme.palette.success.main,
          paddingTop: 0,
          paddingBottom: 0,
          '& .MuiAlert-icon': {
            color: theme.palette.success.main,
          },
          '& .MuiAlert-message': {
            fontWeight: 600,
            color: theme.palette.secondary.main,
          },
        },
        outlinedWarning: {
          backgroundColor: theme.palette.warning.light,
          borderColor: theme.palette.warning.main,
          paddingTop: 0,
          paddingBottom: 0,
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main,
          },
          '& .MuiAlert-message': {
            fontWeight: 600,
            color: theme.palette.secondary.main,
          },
        },
        standardError: {
          border: '1px solid',
          borderColor: theme.palette.error.dark,
          backgroundColor: '#fdeded',
          color: theme.palette.grey[900],
          '& .MuiAlert-icon': {
            color: theme.palette.error.dark,
          },
        },
        filledInfo: {
          backgroundColor: '#E4F1F3',
          color: theme.palette.secondary.dark,

          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: '#0290A1',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          fontWeight: 500,
        },
        avatar: {
          color: '#fff',
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconEmpty: {
          color: theme.palette.grey[300],
          '& .rating-label': {
            visibility: 'hidden',
          },
        },
        iconActive: {
          '&.rating-1': {
            color: theme.palette.error.dark,
          },
          '&.rating-2': {
            color: theme.palette.error.main,
          },
          '&.rating-3': {
            color: theme.palette.warning.main,
          },
          '&.rating-4': {
            color: theme.palette.success.main,
          },
          '&.rating-5': {
            color: '#59C13D',
          },
        },
        iconFilled: {
          '&.rating-1': {
            color: theme.palette.error.dark,
          },
          '&.rating-2': {
            color: theme.palette.error.main,
          },
          '&.rating-3': {
            color: theme.palette.warning.main,
          },
          '&.rating-4': {
            color: theme.palette.success.main,
          },
          '&.rating-5': {
            color: '#59C13D',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: theme.palette.common.white,
          boxShadow: 'none',
          '& .MuiButtonBase-root': {
            padding: theme.spacing(0.5, 1.5),
            alignItems: 'center',
          },

          ':before': {
            display: 'none',
          },
        },
      },
    },
  },
})
