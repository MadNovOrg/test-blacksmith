import { createTheme } from '@mui/material/styles'
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
      grey: ColorPartial
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
      grey: ColorPartial
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
      grey?: ColorPartial
    }
  }

  interface Palette {
    green: Palette['primary']
    dimGrey: Palette['primary']
    secondaryGrey: Palette['primary']
  }

  interface PaletteOptions {
    tertiary: {
      main: string
    }
    green: PaletteOptions['primary']
    teal: PaletteOptions['primary']
    gray: PaletteOptions['primary']
    dimGrey: PaletteOptions['primary']
    secondaryGrey: PaletteOptions['primary']
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    teal: true
    gray: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    gray: true
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
      main: '#D32F2F',
      light: '#FAE6E6',
      dark: '#990F0F',
    },
    success: {
      main: '#9EB934',
      light: '#F0F4DD',
      dark: '#394700',
    },
    green: {
      main: '#59C13D',
    },
    teal: {
      contrastText: '#fff',
      main: '#0290A1',
    },
    gray: {
      contrastText: '#3B3A3C',
      main: '#EEEEEE',
    },
    dimGrey: {
      main: '#6C6A6F',
    },
    secondaryGrey: {
      main: '#344054',
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

export const APP_BAR_HEIGHT = 72
export const FOOTER_HEIGHT = 96

export default createTheme({
  ...theme,
  breakpoints,
  typography: {
    fontFamily: ['Inter', 'sans-serif', 'Arial'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: '700',
      color: theme.palette.grey[900],
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: theme.palette.grey[900],
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: theme.palette.grey[900],
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: '500',
      color: theme.palette.grey[900],
    },
    h5: {
      fontSize: '1.15rem',
      fontWeight: '500',
      color: theme.palette.grey[900],
    },
    h6: {
      fontSize: '1rem',
      fontWeight: '500',
      color: theme.palette.grey[900],
    },

    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: '600',
    },

    subtitle2: {
      fontSize: '1.125rem',
      fontWeight: '500',
    },

    body1: {
      fontSize: '1rem',
      fontWeight: '400',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: '400',
      color: theme.palette.dimGrey.main,
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
          minHeight: APP_BAR_HEIGHT,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          [theme.breakpoints.up('xs')]: {
            minHeight: APP_BAR_HEIGHT,
          },
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
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[100],
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
          padding: '.75rem .5rem',
          height: 36, // for td's height acts like minHeight
          '&.MuiTableCell-paddingCheckbox': {
            width: 0,
            padding: '2px .5rem 2px 2px',
            '.MuiCheckbox-root': {
              padding: 3,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '3px',
          backgroundColor: theme.palette.grey[400],
          '&.dotted': {
            backgroundColor: 'transparent',
            '& > .MuiLinearProgress-bar': {
              backgroundColor: 'transparent',
              borderBottom: '4px dotted' + theme.colors.fuschia['500'],
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          color: theme.palette.dimGrey.main,
          fontWeight: 500,
          '.MuiTableRow-root': {
            backgroundColor: theme.palette.grey[100],
          },
          '.MuiTableCell-root': {
            fontSize: 13,
            fontWeight: '500',
            color: theme.palette.dimGrey.main,
            padding: '.6em .5rem',
            lineHeight: '1.3rem',
          },
          '.MuiTableSortLabel-root': {
            '.MuiTableSortLabel-icon': {
              fontSize: '1.2em',
              opacity: 1,
              color: theme.palette.grey[400],
            },
            '&.Mui-active': {
              color: theme.palette.grey[800],
              '.MuiTableSortLabel-icon': {
                opacity: 1,
                color: theme.palette.primary.light,
              },
            },
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.common.white,
          '.MuiTableRow-root:last-of-type': {
            borderBottom: 'none',
          },
          '.MuiTableRow-root': {
            borderBottom: '1px solid',
            borderColor: theme.palette.grey[200],
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
          fontWeight: 400,
          padding: '10px',
          textTransform: 'none',

          '&.Mui-selected': {
            color: theme.palette.text.primary,
            fontWeight: 600,
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
            fontWeight: 500,
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
            fontWeight: 500,
            color: theme.palette.secondary.main,
          },
        },
        outlinedError: {
          backgroundColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          paddingTop: 0,
          paddingBottom: 0,
          '& .MuiAlert-icon': {
            color: theme.palette.error.main,
          },
          '& .MuiAlert-message': {
            fontWeight: 500,
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
            color: theme.colors.teal[500],
          },
        },
        outlinedInfo: {
          backgroundColor: theme.colors.teal[100],
          borderColor: theme.colors.teal[500],
          color: theme.palette.secondary.main,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          fontWeight: 500,

          '& .MuiAlert-icon': {
            alignItems: 'center',
            color: theme.colors.teal[500],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          fontWeight: 500,

          '&.MuiChip-colorWarning': {
            color: '#7A4E00',
            backgroundColor: '#FEF4E4',
            fontWeight: 600,
          },
          '&.MuiChip-colorInfo': {
            color: '#055A64',
            backgroundColor: '#E1F2F4',
            fontWeight: 600,
          },
          '&.MuiChip-colorSuccess': {
            color: '#394700',
            backgroundColor: '#F3F5E6',
            fontWeight: 600,
          },
          '&.MuiChip-colorError': {
            color: '#990650',
            backgroundColor: '#F8EDF3',
            fontWeight: 600,
          },
          '&.MuiChip-colorDefault': {
            color: '#3B3A3C',
            backgroundColor: '#EEEEEE',
            fontWeight: 600,
          },
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
