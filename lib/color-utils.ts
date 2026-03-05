import type { BackgroundConfig } from "./og-types"

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "")
  const bigint = parseInt(h, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

/** WCAG 2.0 relative luminance */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/** Returns true if text should be dark on this background */
export function shouldUseDarkText(bg: BackgroundConfig): boolean {
  if (bg.mode === "solid") {
    return luminance(bg.solidColor) > 0.179
  }
  // Average luminance of gradient stops
  const avg = (luminance(bg.gradientFrom) + luminance(bg.gradientTo)) / 2
  return avg > 0.179
}
