// src/pages/Contact.jsx
import React, { useMemo, useState } from "react";

/**
 * Contact page that submits via mailto:
 * - No backend required: opens user's email client with subject/body prefilled.
 * - A11y: proper labels, required fields, keyboard-friendly .focus-ring classes.
 * - Tailwind-only styling (no inline <style>).
 *
 * How it works:
 *  - On submit, we build a mailto URL using the form data, then set window.location.href to that URL.
 *  - You can change the "to" address below to your real support inbox.
 */
export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Contact request from Digital Booking",
    message: "",
  });

  // Change this to your real inbox
  const supportEmail = "contact@digital-booking.local";

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.message.trim().length > 4
    );
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buildMailto() {
    const subject = encodeURIComponent(form.subject || "Contact request");
    const body = encodeURIComponent(
      [
        `Hi Digital Booking team,`,
        ``,
        `My name is: ${form.name}`,
        `My email is: ${form.email}`,
        ``,
        `Message:`,
        form.message,
        ``,
        `— Sent from Digital Booking contact page`,
      ].join("\n")
    );
    return `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const href = buildMailto();
    // Open mail client
    window.location.href = href;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Contact us</h1>
        <p className="text-slate-600 mt-1">
          Send us a message and we’ll get back to you as soon as possible.
        </p>
      </header>

      <form onSubmit={onSubmit} className="card p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            className="input focus-ring mt-1"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input focus-ring mt-1"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            className="input focus-ring mt-1"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="input focus-ring mt-1"
            placeholder="Write your message here..."
            value={form.message}
            onChange={handleChange}
            required
            minLength={5}
            />
            <p className="text-xs text-slate-500 mt-1">
                Your default email app will open to send the message.
            </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
            <a
                href="/"
                className="btn-outline focus-ring"
            >
                Cancel
            </a>
            <button
                type="submit"
                className="btn-primary focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canSubmit}
            >
                Send message
            </button>
            </div>
        </form>
        </div>
    );
    }
