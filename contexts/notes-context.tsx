"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

export interface Note {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface NotesContextType {
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "authorId">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  getNoteById: (id: string) => Note | undefined
  isLoading: boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to Notes Platform",
    content:
      "This is your first note! You can create, edit, and share your thoughts here. The platform supports rich text formatting and tagging.",
    author: "Demo User",
    authorId: "1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["welcome", "getting-started"],
  },
  {
    id: "2",
    title: "Ideas for Tomorrow",
    content:
      "Here are some ideas I want to explore:\n\n• Learn a new programming language\n• Start a side project\n• Read more books\n• Exercise regularly",
    author: "Demo User",
    authorId: "1",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    tags: ["ideas", "goals", "personal"],
  },
]

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load notes when component mounts or user changes
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem("notes_platform_data")
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes)
          setNotes(Array.isArray(parsedNotes) ? parsedNotes : [])
        } else {
          // First time user - set initial notes
          setNotes(initialNotes)
          localStorage.setItem("notes_platform_data", JSON.stringify(initialNotes))
        }
      } catch (error) {
        console.error("Error loading notes:", error)
        setNotes(initialNotes)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [])

  // Save notes whenever notes array changes
  useEffect(() => {
    if (!isLoading && notes.length >= 0) {
      try {
        localStorage.setItem("notes_platform_data", JSON.stringify(notes))
      } catch (error) {
        console.error("Error saving notes:", error)
      }
    }
  }, [notes, isLoading])

  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt" | "authorId">) => {
    if (!user) return

    const newNote: Note = {
      ...noteData,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => {
      const updated = [newNote, ...prev]
      return updated
    })
  }

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...noteData, updatedAt: new Date().toISOString() } : note)),
    )
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const getNoteById = (id: string) => {
    return notes.find((note) => note.id === id)
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNoteById, isLoading }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider")
  }
  return context
}
