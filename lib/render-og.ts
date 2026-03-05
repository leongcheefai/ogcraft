import satori from "satori"
import { initWasm, Resvg } from "@resvg/resvg-wasm"
import type { OGConfig } from "./og-types"
import { getTheme } from "./og-themes"

const fontCache: Map<string, ArrayBuffer> = new Map()
let wasmInitialized = false

/**
 * Loads a font via our server-side API route which proxies Google Fonts
 * and ensures we get a TTF binary (not WOFF2 which Satori can't read).
 */
async function loadFont(weight: number): Promise<ArrayBuffer> {
  const cacheKey = `inter-${weight}`
  if (fontCache.has(cacheKey)) return fontCache.get(cacheKey)!

  const response = await fetch(`/api/font?weight=${weight}`)
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Failed to load font weight ${weight}: ${errText}`)
  }

  const buffer = await response.arrayBuffer()
  fontCache.set(cacheKey, buffer)
  return buffer
}

async function ensureWasm(): Promise<void> {
  if (wasmInitialized) return
  try {
    const wasmResponse = await fetch(
      "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm"
    )
    if (!wasmResponse.ok) {
      throw new Error(`Failed to load WASM: ${wasmResponse.status}`)
    }
    await initWasm(wasmResponse)
    wasmInitialized = true
  } catch (e) {
    // If already initialized, that's ok
    if (
      e instanceof Error &&
      e.message.includes("Already initialized")
    ) {
      wasmInitialized = true
      return
    }
    throw e
  }
}

function buildSatoriElement(config: OGConfig) {
  const theme = getTheme(config.theme)
  const textColor = theme.darkText ? "#18181b" : "#ffffff"
  const subtextColor = theme.darkText
    ? "rgba(24, 24, 27, 0.7)"
    : "rgba(255, 255, 255, 0.8)"
  const slugColor = theme.darkText
    ? "rgba(24, 24, 27, 0.5)"
    : "rgba(255, 255, 255, 0.5)"

  // Parse gradient for satori (it needs separate background props)
  const isGradient = theme.cssBackground.includes("gradient")

  const children: React.ReactNode[] = []

  // Logo
  if (config.logo) {
    children.push({
      type: "div",
      props: {
        style: { display: "flex", marginBottom: 16 },
        children: {
          type: "img",
          props: {
            src: config.logo,
            width: 96,
            height: 96,
            style: { borderRadius: 6, objectFit: "contain" as const },
          },
        },
      },
    })
  }

  // Title
  children.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        fontSize: config.title.length > 40 ? 56 : 72,
        fontWeight: 700,
        color: textColor,
        lineHeight: 1.1,
        maxWidth: "90%",
      },
      children: config.title || "Your Title Here",
    },
  })

  // Description
  if (config.description) {
    children.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          fontSize: 28,
          fontWeight: 400,
          color: subtextColor,
          lineHeight: 1.5,
          maxWidth: "80%",
          marginTop: 16,
        },
        children: config.description,
      },
    })
  }

  // Build the main wrapper children array
  const wrapperChildren: React.ReactNode[] = [
    // Content area
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          flex: 1,
          padding: 64,
        },
        children,
      },
    },
  ]

  // Slug at bottom right
  if (config.slug) {
    wrapperChildren.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "flex-end" as const,
          padding: "0 64px 48px 64px",
          fontSize: 20,
          color: slugColor,
          fontFamily: "Inter",
        },
        children: config.slug,
      },
    })
  }

  // Volt accent line
  if (theme.accentColor) {
    wrapperChildren.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          width: "100%",
          height: 4,
          backgroundColor: theme.accentColor,
        },
      },
    })
  }

  const bgStyle: Record<string, string> = isGradient
    ? { backgroundImage: theme.cssBackground }
    : { backgroundColor: theme.cssBackground }

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        width: "100%",
        height: "100%",
        ...bgStyle,
      },
      children: wrapperChildren,
    },
  }
}

export async function renderOGImage(config: OGConfig): Promise<Uint8Array> {
  const [fontData, fontBoldData] = await Promise.all([
    loadFont(400),
    loadFont(700),
    ensureWasm(),
  ])

  const element = buildSatoriElement(config)

  const svg = await satori(element as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fontData, weight: 400, style: "normal" as const },
      { name: "Inter", data: fontBoldData, weight: 700, style: "normal" as const },
    ],
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width" as const, value: 1200 },
  })
  const pngData = resvg.render()
  return pngData.asPng()
}
