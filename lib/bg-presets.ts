import type { BackgroundConfig } from "./og-types"

export const gradientPresets: { from: string; to: string }[] = [
  // Row 1: Dark & moody
  { from: "#0f0f0f", to: "#1a1a2e" },
  { from: "#1a1a2e", to: "#16213e" },
  { from: "#18181b", to: "#09090b" },
  { from: "#14532d", to: "#052e16" },
  { from: "#1e1b4b", to: "#312e81" },
  { from: "#27272a", to: "#18181b" },
  { from: "#0c0a09", to: "#292524" },
  // Row 2: Cool
  { from: "#0ea5e9", to: "#8b5cf6" },
  { from: "#06b6d4", to: "#3b82f6" },
  { from: "#8b5cf6", to: "#ec4899" },
  { from: "#6366f1", to: "#a855f7" },
  { from: "#2563eb", to: "#7c3aed" },
  { from: "#0891b2", to: "#0d9488" },
  { from: "#3b82f6", to: "#06b6d4" },
  // Row 3: Warm & vibrant
  { from: "#f97316", to: "#ec4899" },
  { from: "#ef4444", to: "#f97316" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#ec4899", to: "#f43f5e" },
  { from: "#d946ef", to: "#f97316" },
  { from: "#f43f5e", to: "#a855f7" },
  { from: "#eab308", to: "#22c55e" },
  // Row 4: Pastel & light
  { from: "#fecdd3", to: "#fae8ff" },
  { from: "#e0f2fe", to: "#f0fdf4" },
  { from: "#fef3c7", to: "#fce7f3" },
  { from: "#dbeafe", to: "#e0e7ff" },
  { from: "#ccfbf1", to: "#cffafe" },
  { from: "#f5f5f4", to: "#e7e5e4" },
  { from: "#fafafa", to: "#e4e4e7" },
]

export const solidPresets: { color: string }[] = [
  // Row 1: Darks
  { color: "#0f0f0f" },
  { color: "#18181b" },
  { color: "#1c1917" },
  { color: "#27272a" },
  { color: "#1a1a2e" },
  { color: "#14532d" },
  { color: "#1e1b4b" },
  // Row 2: Mid tones
  { color: "#3b82f6" },
  { color: "#8b5cf6" },
  { color: "#ec4899" },
  { color: "#ef4444" },
  { color: "#f97316" },
  { color: "#eab308" },
  { color: "#22c55e" },
  // Row 3: Brights
  { color: "#06b6d4" },
  { color: "#6366f1" },
  { color: "#d946ef" },
  { color: "#f43f5e" },
  { color: "#0ea5e9" },
  { color: "#10b981" },
  { color: "#a855f7" },
  // Row 4: Lights
  { color: "#fafafa" },
  { color: "#f5f5f4" },
  { color: "#fef3c7" },
  { color: "#e0f2fe" },
  { color: "#fce7f3" },
  { color: "#f0fdf4" },
  { color: "#e0e7ff" },
]

export function bgConfigToCss(bg: BackgroundConfig): string {
  if (bg.mode === "solid") {
    return bg.solidColor
  }
  return `linear-gradient(${bg.gradientDirection}, ${bg.gradientFrom}, ${bg.gradientTo})`
}
