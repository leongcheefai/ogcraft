import { NextRequest, NextResponse } from "next/server"

/**
 * Server-side font proxy for Satori.
 * Fetches Inter font from Google Fonts CSS API with a TTF-requesting User-Agent
 * so we get TTF/OTF URLs (which Satori supports), not WOFF2.
 */
export async function GET(request: NextRequest) {
  const weight = request.nextUrl.searchParams.get("weight") || "400"

  try {
    // Use a User-Agent that requests TTF format from Google Fonts
    const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`
    const cssResponse = await fetch(cssUrl, {
      headers: {
        // This ancient Safari UA forces Google Fonts to serve .ttf files
        "User-Agent": "Safari/605.1.15",
      },
    })

    if (!cssResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch font CSS" },
        { status: 500 }
      )
    }

    const css = await cssResponse.text()

    // Extract the font URL from CSS — Google serves .ttf for this UA
    const urlMatch = css.match(/src:\s*url\(([^)]+)\)/)
    if (!urlMatch || !urlMatch[1]) {
      return NextResponse.json(
        { error: "Could not parse font URL from CSS", css },
        { status: 500 }
      )
    }

    const fontUrl = urlMatch[1]
    const fontResponse = await fetch(fontUrl)
    if (!fontResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch font binary" },
        { status: 500 }
      )
    }

    const fontBuffer = await fontResponse.arrayBuffer()

    return new NextResponse(fontBuffer, {
      headers: {
        "Content-Type": "font/ttf",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Font proxy error:", error)
    return NextResponse.json(
      { error: "Font proxy failed" },
      { status: 500 }
    )
  }
}
