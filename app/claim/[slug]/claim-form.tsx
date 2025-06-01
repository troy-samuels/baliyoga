"use client"

import { useState } from "react"
import { createServerClient } from "@/lib/supabase"
import Link from "next/link"

export function ClaimForm({ businessName, businessSlug }: { businessName: string, businessSlug: string }) {
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "", message: "", confirm: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createServerClient()
    const { error } = await supabase.from('baliyoga_claims_request').insert([
      {
        business_slug: businessSlug,
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone,
        message: form.message,
        confirm: form.confirm,
        created_at: new Date().toISOString(),
      }
    ])
    setLoading(false)
    if (error) {
      setError("There was a problem submitting your claim. Please try again or contact support.")
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f3e9] px-4 py-12">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center">
        {submitted ? (
          <div className="text-center text-[#5d4c42]">
            <h2 className="text-xl font-bold mb-2">Thanks!</h2>
            <p>Your request has been received.<br />We'll get back to you within 48 hours.</p>
            <Link href="/" className="mt-6 inline-block text-[#a39188] underline">Back to Directory</Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#5d4c42] mb-2 text-center">Claim {businessName}</h2>
            <p className="mb-4 text-[#a39188] text-center">Fill out the form below to claim this listing.</p>
            <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
              <input name="name" required placeholder="Full Name" className="rounded px-3 py-2 border border-[#e6ceb3] focus:border-[#a39188]" value={form.name} onChange={handleChange} />
              <input name="role" required placeholder="Role (Owner, Manager...)" className="rounded px-3 py-2 border border-[#e6ceb3] focus:border-[#a39188]" value={form.role} onChange={handleChange} />
              <input name="email" type="email" required placeholder="Business Email" className="rounded px-3 py-2 border border-[#e6ceb3] focus:border-[#a39188]" value={form.email} onChange={handleChange} />
              <input name="phone" type="tel" required placeholder="Phone Number" className="rounded px-3 py-2 border border-[#e6ceb3] focus:border-[#a39188]" value={form.phone} onChange={handleChange} />
              <textarea name="message" placeholder="Message (optional)" className="rounded px-3 py-2 border border-[#e6ceb3] focus:border-[#a39188]" value={form.message} onChange={handleChange} />
              <label className="flex items-center gap-2 text-[#5d4c42] text-sm">
                <input type="checkbox" name="confirm" required checked={form.confirm} onChange={handleChange} />
                I confirm I am authorized to manage this business.
              </label>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="rounded-xl bg-[#e6ceb3] px-4 py-2 text-[#5d4c42] font-semibold shadow hover:bg-[#a39188] transition mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Claim"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
} 