const colorWithOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${variableName})`;
  };
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colorWithOpacity('--primary'),
        'primary-variant': colorWithOpacity('--primary-variant'),
        secondary: colorWithOpacity('--secondary'),
        'secondary-variant': colorWithOpacity('--secondary-variant'),
        background: colorWithOpacity('--background'),
        surface: colorWithOpacity('--surface'),
        'surface-variant': colorWithOpacity('--surface-variant'),
        overlay: colorWithOpacity('--overlay'),
        'on-primary': colorWithOpacity('--on-primary'),
        'on-secondary': colorWithOpacity('--on-secondary'),
        'on-background': colorWithOpacity('--on-background'),
        'on-surface': colorWithOpacity('--on-surface'),
        'on-surface-variant': colorWithOpacity('--on-surface-variant'),
        'surface-container-lowest': colorWithOpacity('--surface-container-lowest'),
        'surface-container-low': colorWithOpacity('--surface-container-low'),
        'surface-container': colorWithOpacity('--surface-container'),
        'surface-container-high': colorWithOpacity('--surface-container-high'),
        'surface-container-highest': colorWithOpacity('--surface-container-highest'),
        'inverse-surface': colorWithOpacity('--inverse-surface'),
        'outline-variant': colorWithOpacity('--outline-variant'),
        outline: colorWithOpacity('--outline'),
        success: colorWithOpacity('--success'),
        warning: colorWithOpacity('--warning'),
        error: colorWithOpacity('--error'),
        info: colorWithOpacity('--info'),
        border: colorWithOpacity('--border'),
        divider: colorWithOpacity('--divider'),
        disabled: colorWithOpacity('--disabled'),
        placeholder: colorWithOpacity('--placeholder'),
        'error-container': colorWithOpacity('--error-container'),
        'surface-dim': colorWithOpacity('--surface-dim'),
        'surface-bright': colorWithOpacity('--surface-bright'),
        'primary-container': colorWithOpacity('--primary-container'),
        tertiary: colorWithOpacity('--tertiary'),
        'tertiary-container': colorWithOpacity('--tertiary-container'),
        'on-tertiary': colorWithOpacity('--on-tertiary'),
        'inverse-primary': colorWithOpacity('--inverse-primary'),
        'surface-tint': colorWithOpacity('--surface-tint'),
        'primary-fixed': colorWithOpacity('--primary-fixed'),
        'secondary-fixed': colorWithOpacity('--secondary-fixed'),
        'tertiary-fixed': colorWithOpacity('--tertiary-fixed'),
        'on-primary-fixed': colorWithOpacity('--on-primary-fixed'),
        'on-secondary-fixed': colorWithOpacity('--on-secondary-fixed'),
        'on-tertiary-fixed': colorWithOpacity('--on-tertiary-fixed'),
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        'headline-md': ['Plus Jakarta Sans'],
        'body-md': ['Plus Jakarta Sans'],
        'label-sm': ['Plus Jakarta Sans'],
        'label-lg': ['Plus Jakarta Sans'],
      },
      boxShadow: {
        sm: '0 1px 3px var(--shadow-color-sm), 0 1px 2px var(--shadow-color-sm-inner)',
        md: '0 4px 6px var(--shadow-color-md), 0 2px 4px var(--shadow-color-md-inner)',
        lg: '0 10px 15px var(--shadow-color-lg), 0 4px 6px var(--shadow-color-lg-inner)',
        inner: 'inset 0 2px 4px var(--shadow-color-inner)',
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      animation: {
        'spin-fast': 'spin 0.7s linear infinite',
        'spin-slow': 'spin 0.8s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-mobile': 'slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.3s ease both',
        'fade-out-particle': 'fadeOutParticle 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
