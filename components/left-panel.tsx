"use client"

import type { OGConfig, ThemeName } from "@/lib/og-types"
import { ThemePicker } from "./theme-picker"
import { LogoUpload } from "./logo-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "./theme-toggle"

interface LeftPanelProps {
  config: OGConfig
  onConfigChange: (config: OGConfig) => void
}

const MAX_TITLE_LENGTH = 60

export function LeftPanel({ config, onConfigChange }: LeftPanelProps) {
  function update(partial: Partial<OGConfig>) {
    onConfigChange({ ...config, ...partial })
  }

  const titleLength = config.title.length
  const isOverLimit = titleLength > MAX_TITLE_LENGTH

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-foreground font-sans">OGCraft</h1>
          <p className="text-xs text-muted-foreground">
            Instant Open Graph image generator
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="h-px bg-border" />

      {/* Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="og-title" className="text-sm font-medium text-foreground">
            Title
          </Label>
          <span
            className={`font-mono text-xs ${
              isOverLimit ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {titleLength}/{MAX_TITLE_LENGTH}
          </span>
        </div>
        <Input
          id="og-title"
          value={config.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Your amazing title"
          className="bg-secondary text-foreground placeholder:text-muted-foreground"
        />
        {isOverLimit && (
          <p className="text-xs text-destructive">
            Title is longer than recommended. It may get cut off.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="og-desc" className="text-sm font-medium text-foreground">
          Description
        </Label>
        <Textarea
          id="og-desc"
          value={config.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="A short supporting description..."
          rows={3}
          className="resize-none bg-secondary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* URL Slug */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="og-slug" className="text-sm font-medium text-foreground">
          URL Slug
        </Label>
        <Input
          id="og-slug"
          value={config.slug}
          onChange={(e) => update({ slug: e.target.value })}
          placeholder="myapp.com/blog/post"
          className="font-mono text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Theme Picker */}
      <ThemePicker
        selected={config.theme}
        onSelect={(theme: ThemeName) => update({ theme })}
      />

      {/* Logo Upload */}
      <LogoUpload
        logo={config.logo}
        onLogoChange={(logo) => update({ logo })}
      />
    </div>
  )
}
