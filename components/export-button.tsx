"use client"

import { useState } from "react"
import { Download, Copy, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OGConfig } from "@/lib/og-types"
import { renderOGImage } from "@/lib/render-og"
import { toast } from "sonner"

interface ExportButtonProps {
  config: OGConfig
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50)
}

export function ExportButton({ config }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleExport() {
    setIsExporting(true)
    try {
      const pngBytes = await renderOGImage(config)
      const blob = new Blob([pngBytes], { type: "image/png" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `og-${slugify(config.title) || "image"}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Image downloaded!")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  async function handleCopy() {
    setIsCopying(true)
    try {
      const pngBytes = await renderOGImage(config)
      const blob = new Blob([pngBytes], { type: "image/png" })
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
      toast.error("Copy failed. Your browser may not support this.")
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-medium"
        size="lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Rendering...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </>
        )}
      </Button>
      <Button
        onClick={handleCopy}
        disabled={isCopying}
        variant="outline"
        size="lg"
        className="border-border text-foreground hover:bg-secondary"
        title="Copy to clipboard"
      >
        {isCopying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
