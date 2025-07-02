"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useNotes } from "@/contexts/notes-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Tag } from "lucide-react"

export default function AddNotePage() {
  const { user, isLoading } = useAuth()
  const { addNote } = useNotes()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    addNote({
      title: title.trim(),
      content: content.trim(),
      author: user.name,
      tags: tagArray,
    })

    router.push("/")
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/" className="btn btn-ghost" style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} />
          Back to Notes
        </Link>

        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Create New Note</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          Share your thoughts and stories with the world
        </p>
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
          <Link href="/" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? (
              <>
                <div className="spinner" />
                Publishing...
              </>
            ) : (
              <>
                <Save size={16} />
                Publish Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
