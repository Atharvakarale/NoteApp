"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNotes } from "@/contexts/notes-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Calendar, User } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const { notes } = useNotes()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Welcome back, {user.name}!</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          Discover and share amazing stories and thoughts
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>No notes yet</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Start sharing your thoughts and stories with the world
          </p>
          <Link href="/add-note" className="btn btn-primary">
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note, index) => (
            <Link key={note.id} href={`/note/${note.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article
                className="card slide-in"
                style={{
                  height: "100%",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    lineHeight: "1.4",
                  }}
                >
                  {note.title}
                </h2>

                <div
                  className="note-content"
                  style={{
                    marginBottom: "1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {note.content}
                </div>

                {note.tags.length > 0 && (
                  <div className="tags">
                    {note.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="note-meta">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <User size={14} />
                    {note.author}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={14} />
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
