"use client"

import type { ThemeName } from "@/lib/og-types"
import { themes } from "@/lib/og-themes"
import { cn } from "@/lib/utils"

interface ThemePickerProps {
  selected: ThemeName
  onSelect: (theme: ThemeName) => void
}

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Theme</label>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => {
          const isSelected = selected === theme.themeName
          const bg = theme.swatchColorEnd
            ? `linear-gradient(135deg, ${theme.swatchColor}, ${theme.swatchColorEnd})`
            : theme.swatchColor

          return (
            <button
              key={theme.themeName}
              type="button"
              onClick={() => onSelect(theme.themeName)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                "ring-offset-background hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "ring-2 ring-foreground ring-offset-2"
              )}
              style={{ background: bg }}
              title={theme.name}
              aria-label={`Select ${theme.name} theme`}
            >
              {theme.themeName === "paper" && (
                <div className="absolute inset-0 rounded-lg border border-border" />
              )}
            </button>
          )
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {themes.find((t) => t.themeName === selected)?.name ?? ""}
      </span>
    </div>
  )
}
