"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: replace with real submit logic or API call
    console.log({ name, email, message });
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-dark">
          {t("name") || "Name"}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
          placeholder={t("namePlaceholder") || "Your name"}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-dark">
          {t("email")}
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
          placeholder={t("email") || "you@email.com"}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-dark">
          {t("message") || "Message"}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
          placeholder={t("messagePlaceholder") || "Your message"}
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-dark-orange py-2 px-4 text-sm font-bold text-white hover:bg-red"
      >
        {sent ? t("sent") || "Sent" : t("send") || "Send"}
      </button>
    </form>
  );
}
