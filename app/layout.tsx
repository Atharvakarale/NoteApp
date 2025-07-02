import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { NotesProvider } from "@/contexts/notes-context"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Notes Platform - Share Your Thoughts",
  description: "A modern platform for sharing thoughts and stories",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotesProvider>
              <div className="app">
                <Navigation />
                <main className="main-content">{children}</main>
              </div>
            </NotesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
