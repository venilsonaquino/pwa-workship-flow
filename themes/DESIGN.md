---
name: Lumina Worship
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cac3d8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#948ea1'
  outline-variant: '#494455'
  surface-tint: '#cdbdff'
  primary: '#cdbdff'
  on-primary: '#370096'
  primary-container: '#7c4dff'
  on-primary-container: '#fcf6ff'
  inverse-primary: '#6833ea'
  secondary: '#ffb954'
  on-secondary: '#452b00'
  secondary-container: '#c3841b'
  on-secondary-container: '#3c2500'
  tertiary: '#78dc77'
  on-tertiary: '#00390a'
  tertiary-container: '#1a842b'
  on-tertiary-container: '#eaffe2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e8deff'
  primary-fixed-dim: '#cdbdff'
  on-primary-fixed: '#20005f'
  on-primary-fixed-variant: '#4f00d0'
  secondary-fixed: '#ffddb4'
  secondary-fixed-dim: '#ffb954'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#94f990'
  tertiary-fixed-dim: '#78dc77'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005313'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1.5rem
  gutter-md: 1rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 2.5rem
---

## Brand & Style

The design system for this authentication flow is built on a **Corporate / Modern** aesthetic with a **Glassmorphic** touch, specifically tailored for a community-driven musical context. It aims to evoke a sense of inspiration, harmony, and professional reliability. 

The visual narrative centers on "The Light of the Stage," using deep purples and vibrant accents to create an immersive, high-end atmosphere. The interface is clean and mobile-first, ensuring that users—whether leaders or members—feel welcomed and focused. Whitespace is used intentionally to separate complex registration steps, reducing cognitive load during onboarding.

## Colors

The palette is optimized for a dark mode experience to reflect the low-light environments typical of worship and music performance settings.

- **Primary (Vibrant Purple):** Used for main actions, brand identity, and active states.
- **Secondary (Pending Amber):** Dedicated to the "Account Pending" status and cautionary feedback.
- **Tertiary (Success Green):** Used for "Access Granted" states and successful verification.
- **Neutral:** A deep charcoal-to-black range that provides high contrast for typography while maintaining the modern glassmorphism aesthetic.
- **Feedback States:** Specific semantic colors for validation errors (Soft Red) and informational prompts (Soft Blue).

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a contemporary, geometric, and friendly tone. 

- **Display & Headlines:** Use tight letter spacing and bold weights to command attention on entry screens.
- **Input Text:** Set at 16px to prevent iOS auto-zoom and ensure maximum readability.
- **Labels:** Use uppercase for small labels to provide structural clarity in dense forms.
- **Hierarchy:** High contrast between titles and body text is essential to guide the user through the multi-step authentication process.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile devices. 

- **Margins:** A consistent 24px (1.5rem) side margin ensures content doesn't hit the screen edges on narrow devices.
- **Vertical Rhythm:** A modular 8px scale is used. Group related items (labels and inputs) with 8px spacing, and separate form sections with 24px.
- **Safe Areas:** Onboarding visuals are positioned in the top 40% of the screen, with interactive form elements occupying the bottom 60% for easy thumb reach.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** and **Backdrop Blurs**:

- **Level 0 (Background):** Deep neutral `#121212`.
- **Level 1 (Cards/Inputs):** Surface color `#1E1E1E` with a subtle 1px border at 10% white opacity.
- **Level 2 (Modals/Popovers):** Semi-transparent purple tint with a 20px backdrop blur to create a glassmorphic effect.
- **Shadows:** Use extremely soft, long-spread shadows (0 12px 32px rgba(0,0,0,0.4)) for floating action buttons or primary cards to simulate physical lift without harsh edges.

## Shapes

The shape language is **Rounded**, leaning towards an organic yet structured feel.

- **Buttons & Inputs:** 0.5rem (8px) base radius for a modern, approachable look.
- **Feature Cards:** 1rem (16px) for larger onboarding containers.
- **Status Indicators:** Pills (fully rounded) are used for "Pending" or "Leader" tags to distinguish them from interactive buttons.

## Components

### Input Fields
- **Default:** Transparent background with a 1px border (`#FFFFFF20`).
- **Focused:** Border color shifts to Primary (`#7C4DFF`) with a subtle outer glow.
- **Error:** Border color shifts to Red (`#FF5252`) with a descriptive helper text below the field.
- **Filled:** Maintain the focused border weight but reduce background opacity.

### Buttons
- **Primary:** Solid purple gradient background with bold white text. High-gloss finish.
- **Secondary (Ghost):** Border-only with Primary color text for "Already have an account" links.
- **Social Login:** Surface-colored cards with brand icons, maintaining the same 8px corner radius.

### Feedback Messages (Status Screens)
- **Pending Account:** Center-aligned layout. Uses the Secondary Amber color for a large icon and a subtle background glow. Typography emphasizes "Aguardando aprovação."
- **Access Released:** Full-screen celebratory state. Uses Tertiary Green accents, haptic feedback on entry, and a clear "Entrar no WorshipFlow" primary button.

### Onboarding Steps
- **Progress Indicator:** Thin horizontal bars at the top of the screen. The active step is represented by a Primary color bar, while inactive steps are low-opacity white.