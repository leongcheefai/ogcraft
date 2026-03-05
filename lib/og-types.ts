export interface OGConfig {
  title: string
  description: string
  slug: string
  theme: ThemeName
  logo: string | null // base64 data URL
}

export type ThemeName =
  | "midnight"
  | "praxor"
  | "volt"
  | "aurora"
  | "sunrise"
  | "forest"
  | "zinc"
  | "paper"

export interface ThemeDefinition {
  name: string
  themeName: ThemeName
  background: string
  /** CSS background value for the preview div */
  cssBackground: string
  /** Whether text should be dark (for light themes like Paper) */
  darkText: boolean
  /** Optional accent color (e.g. Volt's line) */
  accentColor?: string
  /** Swatch preview color */
  swatchColor: string
  /** Secondary swatch color for gradients */
  swatchColorEnd?: string
}
