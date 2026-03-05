"use client"

import type { OGConfig } from "@/lib/og-types"
import { getTheme } from "@/lib/og-themes"

interface OGPreviewProps {
  config: OGConfig
  scale?: number
}

export function OGPreview({ config, scale = 0.5 }: OGPreviewProps) {
  const theme = getTheme(config.theme)
  const textColor = theme.darkText ? "#18181b" : "#ffffff"
  const subtextColor = theme.darkText
    ? "rgba(24, 24, 27, 0.7)"
    : "rgba(255, 255, 255, 0.8)"
  const slugColor = theme.darkText
    ? "rgba(24, 24, 27, 0.5)"
    : "rgba(255, 255, 255, 0.5)"

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Scaled container - the inner div is 1200x630 but CSS-scaled down */}
      <div
        className="w-full overflow-hidden rounded-lg border border-border shadow-2xl"
        style={{
          height: 630 * scale,
        }}
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
            style={{ background: theme.cssBackground }}
          />

          {/* Volt accent line */}
          {theme.accentColor && (
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: theme.accentColor }}
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
                  style={{
                    color: slugColor,
                    fontSize: 20,
                  }}
                >
                  {config.slug}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size indicator */}
      <span className="font-mono text-xs text-muted-foreground">
        {"1200 x 630"}
      </span>
    </div>
  )
}
