"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useNotes } from "@/contexts/notes-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Tag } from 'lucide-react'

export default function EditNotePage({ params }: { params: { id: string } }) {
  const { user, isLoading: authLoading } = useAuth()
  const { getNoteById, updateNote } = useNotes()
  const router = useRouter()

  const noteId = params.id
  const [note, setNote] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundNote = getNoteById(noteId)
    if (foundNote) {
      setNote(foundNote)
      setTitle(foundNote.title)
      setContent(foundNote.content)
      setTags(foundNote.tags ? foundNote.tags.join(", ") : "")
    }
    setIsLoading(false)
  }, [noteId, getNoteById])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
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
            The note you're trying to edit doesn't exist or has been deleted.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (note.author !== user.name && note.authorId !== user.id) {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Access Denied</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>You can only edit your own notes.</p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    updateNote(noteId, {
      title: title.trim(),
      content: content.trim(),
      tags: tagArray,
    })

    router.push(`/note/${noteId}`)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <Link href={`/note/${noteId}`} className="btn btn-ghost" style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} />
          Back to Note
        </Link>

        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Edit Note</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>Update your thoughts and stories</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title..."
            required
            style={{ fontSize: "1.125rem" }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story or thoughts here..."
            required
            rows={12}
            style={{ fontSize: "1rem", lineHeight: "1.6" }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Tag size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
            Tags (optional)
          </label>
          <input
            type="text"
            className="form-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas (e.g., personal, ideas, inspiration)"
          />
          <small
            style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", display: "block" }}
          >
            Tags help others discover your content
          </small>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Link href={`/note/${noteId}`} className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? (
              <>
                <div className="spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
