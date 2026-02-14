"use client";

import React, { useState } from "react";

const CONTACT_EMAIL = "axuorainnovations@gmail.com";
const FORMSPREE_FORM_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "mjgewyza";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_URL) {
      const subject = encodeURIComponent(`Contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Contact from ${name}`,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-left text-sm font-medium text-[#333333]"
        >
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-left text-sm font-medium text-[#333333]"
        >
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-left text-sm font-medium text-[#333333]"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here. We’ll get back to you as soon as we can."
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {status === "success" && (
        <p className="rounded-lg bg-primary/10 px-4 py-3 text-left text-sm font-medium text-primary">
          Thanks! We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-left text-sm text-red-700">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-primary py-3.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
