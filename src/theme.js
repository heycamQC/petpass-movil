export const colors = {
  // Base oficial
  primary: '#aaa648',
  primaryDark: '#a49e49',

  danger: '#df6d41',
  orange: '#df683e',
  orangeSoft: '#e38356',

  success: '#6f8e5b',

  blue: '#8da7cc',
  blueDark: '#7892b7',
  blueSoft: '#a2b7d4',

  yellow: '#f7d695',
  yellowNav: '#f7d79a',
  yellowSoft: '#f8dfa1',

  accent: '#efd8a2',

  background: '#faf7ef',
  backgroundSoft: '#fcf9ee',

  surface: '#ffffff',

  text: '#5e5a57',
  textDark: '#3b3936',
  brandDark: '#524b48',
  heading: '#55524e',

  muted: '#7d7976',
  placeholder: '#797672',

  border: '#d8d1c2',

  darkCard: '#5b5451',

  dangerBg: '#fbe8df',
  disabledBg: '#fef0db',
  disabledBorder: '#e58b66',

  white: '#ffffff',
  black: '#000000',
}

export const fonts = {
  body: 'Poppins_400Regular',
  bodyMedium: 'Poppins_500Medium',
  bodySemiBold: 'Poppins_600SemiBold',
  bodyBold: 'Poppins_700Bold',

  displaySemiBold: 'MuseoModerno_600SemiBold',
  displayBold: 'MuseoModerno_700Bold',
  displayExtraBold: 'MuseoModerno_800ExtraBold',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  card: 40,
  onboarding: 44,
  pill: 999,
}

export const typography = {
  tiny: 11,
  small: 13,
  body: 14,
  bodyLarge: 16,
  button: 20,
  subheading: 19,
  heading: 26,
  title: 32,
  hero: 36,
}

export const shadows = {
  soft: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 9,
    elevation: 3,
  },

  card: {
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 4,
  },

  button: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  orange: {
    shadowColor: colors.orange,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
}