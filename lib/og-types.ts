export type BackgroundMode = "gradient" | "solid"
export type GradientDirection =
  | "to top"
  | "to top right"
  | "to right"
  | "to bottom right"
  | "to bottom"
  | "to bottom left"
  | "to left"
  | "to top left"
export type GridOverlay = "none" | "grid" | "dots"

export interface BackgroundConfig {
  mode: BackgroundMode
  solidColor: string
  gradientFrom: string
  gradientTo: string
  gradientDirection: GradientDirection
  gridOverlay: GridOverlay
}

export interface OGConfig {
  title: string
  description: string
  slug: string
  background: BackgroundConfig
  logo: string | null
}
