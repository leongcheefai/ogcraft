"use client"

import type { BackgroundConfig, BackgroundMode, GradientDirection, GridOverlay } from "@/lib/og-types"
import { gradientPresets, solidPresets } from "@/lib/bg-presets"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft } from "lucide-react"

interface BackgroundPickerProps {
  background: BackgroundConfig
  onChange: (bg: BackgroundConfig) => void
}

const GRADIENT_DIRECTIONS: { dir: GradientDirection; icon: React.ComponentType<{ className?: string }> }[] = [
  { dir: "to top", icon: ArrowUp },
  { dir: "to top right", icon: ArrowUpRight },
  { dir: "to right", icon: ArrowRight },
  { dir: "to bottom right", icon: ArrowDownRight },
  { dir: "to bottom", icon: ArrowDown },
  { dir: "to bottom left", icon: ArrowDownLeft },
  { dir: "to left", icon: ArrowLeft },
  { dir: "to top left", icon: ArrowUpLeft },
]

export function BackgroundPicker({ background, onChange }: BackgroundPickerProps) {
  function update(partial: Partial<BackgroundConfig>) {
    onChange({ ...background, ...partial })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-foreground">Background</Label>
        <p className="text-xs text-muted-foreground">Set a custom background for your image.</p>
      </div>

      <Tabs
        value={background.mode}
        onValueChange={(v) => update({ mode: v as BackgroundMode })}
      >
        <TabsList className="w-full">
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="solid">Solid Color</TabsTrigger>
        </TabsList>

        <TabsContent value="gradient">
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {gradientPresets.map((preset, i) => {
              const isSelected =
                background.gradientFrom === preset.from &&
                background.gradientTo === preset.to
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    update({ gradientFrom: preset.from, gradientTo: preset.to })
                  }
                  className={cn(
                    "h-9 w-full rounded-md transition-all duration-150",
                    "ring-offset-background hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected && "ring-2 ring-foreground ring-offset-2"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                  }}
                  aria-label={`Gradient ${preset.from} to ${preset.to}`}
                />
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="solid">
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {solidPresets.map((preset, i) => {
              const isSelected = background.solidColor === preset.color
              const isLight = preset.color === "#fafafa" || preset.color === "#f5f5f4"
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => update({ solidColor: preset.color })}
                  className={cn(
                    "h-9 w-full rounded-md transition-all duration-150",
                    "ring-offset-background hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected && "ring-2 ring-foreground ring-offset-2",
                    isLight && "border border-border"
                  )}
                  style={{ backgroundColor: preset.color }}
                  aria-label={`Color ${preset.color}`}
                />
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Gradient Direction */}
      {background.mode === "gradient" && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Direction</Label>
          <div className="flex gap-1">
            {GRADIENT_DIRECTIONS.map(({ dir, icon: Icon }) => (
              <button
                key={dir}
                type="button"
                onClick={() => update({ gradientDirection: dir })}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  background.gradientDirection === dir
                    ? "bg-accent text-accent-foreground ring-1 ring-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
                aria-label={`Direction ${dir}`}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid Overlay */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Grid Overlay</Label>
        <Select
          value={background.gridOverlay}
          onValueChange={(v) => update({ gridOverlay: v as GridOverlay })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="dots">Dots</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
