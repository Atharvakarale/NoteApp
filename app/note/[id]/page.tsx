"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNotes } from "@/contexts/notes-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Edit, Trash2 } from 'lucide-react'

export default function NotePage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const { getNoteById, deleteNote } = useNotes()
  const router = useRouter()
  const [note, setNote] = useState<any>(null)
  const [noteLoading, setNoteLoading] = useState(true)

  const noteId = params.id

  useEffect(() => {
    const foundNote = getNoteById(noteId)
    setNote(foundNote)
    setNoteLoading(false)
  }, [noteId, getNoteById])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || noteLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return null

  if (!note) {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Note not found</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(noteId)
      router.push("/")
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/" className="btn btn-ghost" style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} />
          Back to Notes
        </Link>
      </div>

      <article className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}
          >
            {note.title}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <User size={16} />
                {note.author}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Calendar size={16} />
                {formatDate(note.createdAt)}
              </div>
            </div>

            {(user.id === note.authorId || user.name === note.author) && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/edit-note/${noteId}`} className="btn btn-secondary">
                  <Edit size={16} />
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-ghost" style={{ color: "#ef4444" }}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="tags">
              {note.tags.map((tag: string) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="note-content"
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.8",
            marginBottom: "2rem",
          }}
        >
          {note.content}
        </div>

        {note.updatedAt !== note.createdAt && (
          <footer
            style={{
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Last updated: {formatDate(note.updatedAt)}
          </footer>
        )}
      </article>
    </div>
  )
}
