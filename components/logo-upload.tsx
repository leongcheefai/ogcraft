"use client"

import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"

interface LogoUploadProps {
  logo: string | null
  onLogoChange: (logo: string | null) => void
}

export function LogoUpload({ logo, onLogoChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onLogoChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    onLogoChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Logo / Icon
      </label>
      {logo ? (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="Uploaded logo"
              className="h-full w-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Remove logo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <ImagePlus className="h-4 w-4" />
          <span>Upload image</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Upload logo file"
      />
    </div>
  )
}
