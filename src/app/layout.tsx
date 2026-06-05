import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Fleet Tracker",
    description: "Vehicle fleet tracking dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    )
}
