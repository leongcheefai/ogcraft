"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { OGConfig } from "@/lib/og-types"
import { LeftPanel } from "@/components/left-panel"
import { OGPreview } from "@/components/og-preview"
import { ExportButton } from "@/components/export-button"

const DEFAULT_CONFIG: OGConfig = {
  title: "Ship faster with OGCraft",
  description:
    "Generate professional Open Graph images in seconds. No design skills needed.",
  slug: "ogcraft.vercel.app",
  theme: "volt",
  logo: null,
}

export default function Home() {
  const [config, setConfig] = useState<OGConfig>(DEFAULT_CONFIG)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  const calculateScale = useCallback(() => {
    const container = previewContainerRef.current
    if (!container) return
    const containerWidth = container.clientWidth - 48 // account for padding
    const newScale = Math.min(containerWidth / 1200, 0.6)
    setScale(newScale)
  }, [])

  useEffect(() => {
    calculateScale()
    window.addEventListener("resize", calculateScale)
    return () => window.removeEventListener("resize", calculateScale)
  }, [calculateScale])

  return (
    <main className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Left Panel - Controls */}
      <aside className="w-full shrink-0 border-b border-border bg-card lg:w-[380px] lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <LeftPanel config={config} onConfigChange={setConfig} />
          </div>
        </div>
      </aside>

      {/* Right Panel - Preview */}
      <section className="flex flex-1 flex-col" ref={previewContainerRef}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          {/* Preview area */}
          <div
            className="w-full"
            style={{ maxWidth: 1200 * scale + 4 }}
          >
            <OGPreview config={config} scale={scale} />
          </div>

          {/* Export controls */}
          <div className="w-full" style={{ maxWidth: 1200 * scale + 4 }}>
            <ExportButton config={config} />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-center border-t border-border px-6 py-3">
          <span className="font-mono text-xs text-muted-foreground">
            {"Built with OGCraft"}
          </span>

        </footer>
      </section>
    </main>
  )
}
