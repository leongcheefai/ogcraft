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
export type GridOverlay = "none" | "grid" | "graph" | "dots"

export interface GridOverlayConfig {
  pattern: GridOverlay
  color: string
  opacity: number // 0..1
  blur: number // 0..100 percentage
}

export interface BackgroundConfig {
  mode: BackgroundMode
  solidColor: string
  gradientFrom: string
  gradientTo: string
  gradientDirection: GradientDirection
  gridOverlay: GridOverlayConfig
}

export interface OGConfig {
  title: string
  description: string
  slug: string
  background: BackgroundConfig
  logo: string | null
}
