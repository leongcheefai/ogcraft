import satori from "satori"
import { initWasm, Resvg } from "@resvg/resvg-wasm"
import type { OGConfig } from "./og-types"
import { bgConfigToCss } from "./bg-presets"
import { shouldUseDarkText } from "./color-utils"

const fontCache: Map<string, ArrayBuffer> = new Map()
let wasmInitialized = false

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

function buildGridOverlayChildren(
  overlay: string,
  darkText: boolean
): React.ReactNode[] {
  if (overlay === "none") return []

  const color = darkText ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"

  if (overlay === "grid") {
    const children: React.ReactNode[] = []
    // Vertical lines
    for (let x = 40; x < 1200; x += 40) {
      children.push({
        type: "div",
        props: {
          key: `v${x}`,
          style: {
            position: "absolute" as const,
            left: x,
            top: 0,
            width: 1,
            height: 630,
            backgroundColor: color,
          },
        },
      })
    }
    // Horizontal lines
    for (let y = 40; y < 630; y += 40) {
      children.push({
        type: "div",
        props: {
          key: `h${y}`,
          style: {
            position: "absolute" as const,
            left: 0,
            top: y,
            width: 1200,
            height: 1,
            backgroundColor: color,
          },
        },
      })
    }
    return children
  }

  if (overlay === "dots") {
    const dotColor = darkText ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
    const children: React.ReactNode[] = []
    for (let x = 12; x < 1200; x += 24) {
      for (let y = 12; y < 630; y += 24) {
        children.push({
          type: "div",
          props: {
            key: `d${x}-${y}`,
            style: {
              position: "absolute" as const,
              left: x,
              top: y,
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: dotColor,
            },
          },
        },
        )
      }
    }
    return children
  }

  return []
}

function buildSatoriElement(config: OGConfig) {
  const bg = config.background
  const darkText = shouldUseDarkText(bg)
  const textColor = darkText ? "#18181b" : "#ffffff"
  const subtextColor = darkText
    ? "rgba(24, 24, 27, 0.7)"
    : "rgba(255, 255, 255, 0.8)"
  const slugColor = darkText
    ? "rgba(24, 24, 27, 0.5)"
    : "rgba(255, 255, 255, 0.5)"

  const cssBackground = bgConfigToCss(bg)
  const isGradient = bg.mode === "gradient"

  const bgStyle: Record<string, string> = isGradient
    ? { backgroundImage: cssBackground }
    : { backgroundColor: cssBackground }

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

  const wrapperChildren: React.ReactNode[] = []

  // Grid overlay children
  const overlayChildren = buildGridOverlayChildren(bg.gridOverlay, darkText)
  if (overlayChildren.length > 0) {
    wrapperChildren.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
        },
        children: overlayChildren,
      },
    })
  }

  // Content area
  wrapperChildren.push({
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
  })

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
