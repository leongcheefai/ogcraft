"use client"

import type { BackgroundConfig, BackgroundMode, GradientDirection, GridOverlay, GridOverlayConfig } from "@/lib/og-types"
import { gradientPresets, solidPresets } from "@/lib/bg-presets"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, Grid3X3, CircleDot, Ban, MoreHorizontal, LayoutGrid } from "lucide-react"

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
      <GridOverlayPicker
        config={background.gridOverlay}
        onChange={(gridOverlay) => update({ gridOverlay })}
      />

    </div>
  )
}

const GRID_PATTERNS: { value: GridOverlay; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "none", label: "None", icon: Ban },
  { value: "grid", label: "Grid", icon: Grid3X3 },
  { value: "graph", label: "Graph", icon: LayoutGrid },
  { value: "dots", label: "Dots", icon: CircleDot },
]

const GRID_COLORS = [
  { color: "#000000", label: "Black" },
  { color: "#6b7280", label: "Gray" },
  { color: "#ffffff", label: "White" },
]

function GridOverlayPicker({
  config,
  onChange,
}: {
  config: GridOverlayConfig
  onChange: (config: GridOverlayConfig) => void
}) {
  function updateGrid(partial: Partial<GridOverlayConfig>) {
    onChange({ ...config, ...partial })
  }

  const activePattern = GRID_PATTERNS.find((p) => p.value === config.pattern)
  const ActiveIcon = activePattern?.icon ?? Ban

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">Grid Overlay</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <ActiveIcon className="size-4 text-muted-foreground" />
            <span>{activePattern?.label ?? "None"}</span>
            {config.pattern !== "none" && (
              <span className="ml-auto text-xs text-muted-foreground">
                {Math.round(config.opacity * 100)}%
              </span>
            )}
            <MoreHorizontal className="ml-auto size-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Grid Overlay</p>
              <p className="text-xs text-muted-foreground">
                Apply a grid overlay to the background.
              </p>
            </div>

            {/* Pattern */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Pattern</Label>
              <div className="flex gap-1.5">
                {GRID_PATTERNS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateGrid({ pattern: value })}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      config.pattern === value
                        ? "border-foreground bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            {config.pattern !== "none" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium">Color</Label>
                  <div className="flex gap-2">
                    {GRID_COLORS.map(({ color, label }) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateGrid({ color })}
                        className={cn(
                          "size-8 rounded-md border transition-all",
                          "hover:scale-110",
                          config.color === color
                            ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            : "border-border",
                          color === "#ffffff" && "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={label}
                      />
                    ))}
                  </div>
                </div>

                {/* Opacity */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Opacity</Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {config.opacity.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[config.opacity * 100]}
                    onValueChange={([v]) => updateGrid({ opacity: v / 100 })}
                  />
                </div>

                {/* Blur Radius */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Blur Radius</Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {config.blur}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[config.blur]}
                    onValueChange={([v]) => updateGrid({ blur: v })}
                  />
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
