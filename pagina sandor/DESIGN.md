---
name: High-Performance Athletic Red
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#603e39'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#956d67'
  outline-variant: '#ebbbb4'
  surface-tint: '#c00100'
  primary: '#bc0100'
  on-primary: '#ffffff'
  primary-container: '#eb0000'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a8'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#747474'
  on-tertiary-container: '#fefcfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930100'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Oswald
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Oswald
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Oswald
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is a high-performance, athletic-inspired framework designed for speed, precision, and impact. It targets professional athletes, high-stakes environments, and power users who value clarity and momentum. 

The visual style is **Corporate Modern with a High-Contrast Athletic edge**. By pairing a clinical white environment with aggressive red accents and bold, condensed typography, the design system evokes a sense of urgency and elite capability. It avoids decorative clutter in favor of structural integrity and functional energy.

## Colors

The palette is built on a foundation of absolute clarity. 

- **Primary (Elite Red):** Used exclusively for high-priority actions, critical highlights, and brand reinforcement.
- **Secondary (Obsidian):** A near-black dark grey used for primary headings and core UI boundaries to provide weight without the harshness of pure black.
- **Tertiary (Steel):** A mid-tone grey for secondary information, metadata, and disabled states.
- **Background:** Pure white (#FFFFFF) is mandatory for the main canvas to ensure the primary red "pops" with maximum chromatic vibration.

## Typography

The typography strategy utilizes a "Dual-Engine" approach. **Oswald** is the driver for all display, heading, and navigational elements—its condensed, vertical nature suggests strength and efficiency. All Oswald headings should be set in Uppercase to maintain the athletic aesthetic.

**Inter** serves as the functional workhorse for body copy and data. It provides a neutral, highly legible contrast to the expressive headings, ensuring that long-form content remains readable even in high-pressure scenarios.

## Layout & Spacing

This design system employs a **Strict 12-Column Fixed Grid** for desktop and a **Fluid 4-Column Grid** for mobile. 

The spacing rhythm is based on an 8px base unit. Layouts should prioritize generous external margins to "frame" the content, while internal component spacing should be tight and efficient to reflect a "no-waste" professional philosophy. Gutters are kept wide (24px) to ensure that even dense data-heavy layouts feel organized and breathable.

## Elevation & Depth

To maintain the "Elite" professional feel, this design system shuns heavy shadows and skeuomorphism. Depth is communicated through **Low-Contrast Outlines and Tonal Tiering**.

- **Level 0 (Surface):** Pure White (#FFFFFF).
- **Level 1 (Cards/Modules):** Subtle 1px border (#E0E0E0). No shadow.
- **Level 2 (Overlays/Modals):** High-diffusion, low-opacity neutral grey shadow (0px 8px 24px rgba(0,0,0,0.08)) to suggest a slight lift without breaking the flat aesthetic.
- **Interaction:** On hover, elements do not lift; instead, they transition their border color to the Primary Red or a darker grey.

## Shapes

The shape language is **Strictly Sharp**. 0px border-radii are used across all components including buttons, input fields, and cards. This architectural rigidity reinforces the professional, serious, and high-energy nature of the design system. The only exception is for circular avatars or status indicators.

## Components

### Buttons
Primary buttons are solid Elite Red (#FF0000) with white Oswald-Bold uppercase text. Secondary buttons use a 2px Obsidian black border with Obsidian text. All buttons use sharp 0px corners.

### Input Fields
Fields utilize a bottom-border-only style or a very thin 1px full border in Steel grey. Labels are always Oswald-Bold (Uppercase, 12px) positioned above the field for maximum visibility. Focus states trigger a 2px Elite Red bottom border.

### Chips & Tags
Used for status and categorization. These should be rectangular with no radius. For "Active" or "Live" states, use a solid red background. For "Neutral" states, use a light grey background with Obsidian text.

### Cards
Cards are defined by their structure rather than their depth. Use a 1px Steel border or a very subtle light-grey background fill (#F5F5F5) to separate card content from the white background. 

### Progress & Data
Progress bars should be thin (4px) and use Elite Red for the fill. Data visualizations should rely on the primary red for the "target" or "success" metric, and shades of grey for the baseline data.