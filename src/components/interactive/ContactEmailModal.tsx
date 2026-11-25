"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { sendInquiry } from "@/lib/api/contact";
import { useSite } from "@/contexts/SiteContext";

interface ContactEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const ContactEmailModal: React.FC<ContactEmailModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = "",
}) => {
  const { site } = useSite();
  const c = site?.contact;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
    setIsSimulated(false);
  };

  const handleClose = () => {
    onClose();
    if (status === "success") {
      setTimeout(resetForm, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setErrorMessage("Please complete all required fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await sendInquiry({ name, email, subject, message });
      setIsSimulated(Boolean(data.simulated));
      setStatus("success");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to dispatch email. Please try again.";
      setErrorMessage(errorMsg);
      setStatus("error");
    }
  };

  const quickSubjects = c?.quickSubjects || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-neutral-300 bg-white p-6 sm:p-8">
        <DialogHeader className="border-b border-neutral-200 pb-4">
          <div className="mb-1 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            {c?.badge || "Direct Inquiry"}
          </div>
          <DialogTitle className="font-sans text-xl font-bold tracking-tight text-black uppercase sm:text-2xl">
            {c?.modalTitle || "Send Inquiry"}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-neutral-500">
            {c?.modalSubtitle || ""}
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="space-y-4 py-8 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-black" />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans text-lg font-bold tracking-tight text-black uppercase">
                {c?.successTitle || "Message Sent"}
              </h3>
              <p className="font-editorial-body mx-auto max-w-md text-sm text-neutral-700">
                {c?.successMessage || "Thank you for reaching out. Your message has been received."}
              </p>
              {isSimulated && (
                <div className="mt-3 border border-neutral-200 bg-neutral-50 p-2.5 text-left font-mono text-[11px] text-neutral-500">
                  Simulated dispatch mode: configure <code>RESEND_API_KEY</code> on the server.
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                onClick={handleClose}
                variant="default"
                className="w-full px-8 font-mono text-xs uppercase sm:w-auto"
              >
                {c?.closeButton || "Close"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {status === "error" && errorMessage && (
              <div className="flex items-start space-x-2 border border-black/20 bg-neutral-100 p-3 font-mono text-xs text-neutral-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <span>{errorMessage}</span>
              </div>
            )}

            {quickSubjects.length > 0 && (
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                  {c?.topicLabel || "Topic"}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickSubjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`cursor-pointer border px-2 py-1 font-mono text-[11px] transition-colors ${
                        subject === sub
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-semibold tracking-widest text-neutral-700 uppercase">
                {c?.nameLabel || "Full Name"} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c?.namePlaceholder || "Your name"}
                className="w-full border border-neutral-300 bg-white p-2.5 font-sans text-sm focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-semibold tracking-widest text-neutral-700 uppercase">
                {c?.emailFieldLabel || "Email Address"} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c?.emailPlaceholder || "you@example.com"}
                className="w-full border border-neutral-300 bg-white p-2.5 font-sans text-sm focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-semibold tracking-widest text-neutral-700 uppercase">
                {c?.subjectLabel || "Subject"} *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={c?.subjectPlaceholder || "Subject"}
                className="w-full border border-neutral-300 bg-white p-2.5 font-sans text-sm focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] font-semibold tracking-widest text-neutral-700 uppercase">
                {c?.messageLabel || "Message"} *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={c?.messagePlaceholder || "Write your message..."}
                className="font-editorial-body w-full resize-y border border-neutral-300 bg-white p-2.5 text-sm focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-500">
                <Mail className="h-3 w-3" />
                <span>{c?.poweredBy || "Delivered via Resend"}</span>
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 px-6 font-mono text-xs uppercase sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{c?.sendingButton || "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{c?.submitButton || "Send Message"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
