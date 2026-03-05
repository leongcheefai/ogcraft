import type { ThemeDefinition } from "./og-types"

export const themes: ThemeDefinition[] = [
  {
    name: "Midnight",
    themeName: "midnight",
    background: "#0f0f0f",
    cssBackground: "#0f0f0f",
    darkText: false,
    swatchColor: "#0f0f0f",
  },
  {
    name: "Praxor",
    themeName: "praxor",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    cssBackground: "linear-gradient(135deg, #1a1a2e, #16213e)",
    darkText: false,
    swatchColor: "#1a1a2e",
    swatchColorEnd: "#16213e",
  },
  {
    name: "Volt",
    themeName: "volt",
    background: "linear-gradient(180deg, #18181b, #09090b)",
    cssBackground: "linear-gradient(180deg, #18181b, #09090b)",
    darkText: false,
    accentColor: "#c8ff00",
    swatchColor: "#18181b",
    swatchColorEnd: "#c8ff00",
  },
  {
    name: "Aurora",
    themeName: "aurora",
    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    cssBackground: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
    darkText: false,
    swatchColor: "#0ea5e9",
    swatchColorEnd: "#8b5cf6",
  },
  {
    name: "Sunrise",
    themeName: "sunrise",
    background: "linear-gradient(135deg, #f97316, #ec4899)",
    cssBackground: "linear-gradient(135deg, #f97316, #ec4899)",
    darkText: false,
    swatchColor: "#f97316",
    swatchColorEnd: "#ec4899",
  },
  {
    name: "Forest",
    themeName: "forest",
    background: "linear-gradient(135deg, #14532d, #052e16)",
    cssBackground: "linear-gradient(135deg, #14532d, #052e16)",
    darkText: false,
    swatchColor: "#14532d",
    swatchColorEnd: "#052e16",
  },
  {
    name: "Zinc",
    themeName: "zinc",
    background: "#27272a",
    cssBackground: "#27272a",
    darkText: false,
    swatchColor: "#27272a",
  },
  {
    name: "Paper",
    themeName: "paper",
    background: "#fafafa",
    cssBackground: "#fafafa",
    darkText: true,
    swatchColor: "#fafafa",
  },
]

export function getTheme(name: string): ThemeDefinition {
  return themes.find((t) => t.themeName === name) ?? themes[0]
}
