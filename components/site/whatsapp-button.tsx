"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";

export function WhatsAppButton({
  number,
  message,
}: {
  number: string;
  message: string;
}) {
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { number: digits })}
      aria-label="Chat with CA Marketing on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="white" strokeWidth={0} />
    </a>
  );
}
