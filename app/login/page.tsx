"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Invalid credentials. Try demo@example.com / password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ padding: "2rem" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="fade-in">
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem", textAlign: "center" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "2rem" }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isLoading ? <div className="spinner" /> : "Sign In"}
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "var(--secondary)",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            <strong>Demo Credentials:</strong>
            <br />
            Email: demo@example.com
            <br />
            Password: password
          </div>
        </div>
      </div>
    </div>
  )
}
