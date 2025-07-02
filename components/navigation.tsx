"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { Moon, Sun, PlusCircle, LogOut, User } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          Notes Platform
        </Link>

        <div className="nav-links">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/add-note" className={`nav-link ${pathname === "/add-note" ? "active" : ""}`}>
            <PlusCircle size={16} />
            Add Note
          </Link>

          <div className="nav-link">
            <User size={16} />
            {user.name}
          </div>

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button onClick={logout} className="btn btn-ghost">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
