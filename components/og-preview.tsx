"use client"

import type { OGConfig } from "@/lib/og-types"
import { bgConfigToCss } from "@/lib/bg-presets"
import { shouldUseDarkText } from "@/lib/color-utils"

interface OGPreviewProps {
  config: OGConfig
  scale?: number
}

function getGridOverlayCss(overlay: string, darkText: boolean): string | undefined {
  const color = darkText ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"
  if (overlay === "grid") {
    return `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 40px)`
  }
  if (overlay === "dots") {
    const dotColor = darkText ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
    return `radial-gradient(circle at center, ${dotColor} 1px, transparent 1px)`
  }
  return undefined
}

export function OGPreview({ config, scale = 0.5 }: OGPreviewProps) {
  const darkText = shouldUseDarkText(config.background)
  const textColor = darkText ? "#18181b" : "#ffffff"
  const subtextColor = darkText
    ? "rgba(24, 24, 27, 0.7)"
    : "rgba(255, 255, 255, 0.8)"
  const slugColor = darkText
    ? "rgba(24, 24, 27, 0.5)"
    : "rgba(255, 255, 255, 0.5)"

  const gridBg = getGridOverlayCss(config.background.gridOverlay, darkText)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full overflow-hidden rounded-lg border border-border shadow-2xl"
        style={{ height: 630 * scale }}
      >
        <div
          className="relative"
          style={{
            width: 1200,
            height: 630,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Background */}
          <div
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ background: bgConfigToCss(config.background) }}
          />

          {/* Grid overlay */}
          {gridBg && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: gridBg,
                ...(config.background.gridOverlay === "dots"
                  ? { backgroundSize: "24px 24px" }
                  : {}),
              }}
            />
          )}

          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-16">
            {/* Logo */}
            {config.logo && (
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.logo}
                  alt="Logo"
                  className="h-24 w-24 rounded-md object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {/* Title & Description */}
            <div className="flex flex-1 flex-col justify-center gap-4">
              <h1
                className="text-balance font-sans leading-tight font-bold"
                style={{
                  color: textColor,
                  fontSize: config.title.length > 40 ? 56 : 72,
                  maxWidth: "90%",
                  lineHeight: 1.1,
                }}
              >
                {config.title || "Your Title Here"}
              </h1>
              {config.description && (
                <p
                  className="font-sans leading-relaxed font-normal"
                  style={{
                    color: subtextColor,
                    fontSize: 28,
                    maxWidth: "80%",
                  }}
                >
                  {config.description}
                </p>
              )}
            </div>

            {/* Slug */}
            {config.slug && (
              <div className="flex justify-end">
                <span
                  className="font-mono"
                  style={{ color: slugColor, fontSize: 20 }}
                >
                  {config.slug}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="font-mono text-xs text-muted-foreground">
        {"1200 x 630"}
      </span>
    </div>
  )
}
