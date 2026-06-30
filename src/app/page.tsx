"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BENEFITS = [
  { line1: "Handles All Calls", line2: "at Scale" },
  { line1: "Resolves the Most", line2: "Complex Tasks" },
  { line1: "Maintaining CSAT", line2: "w/ AI Personas" },
];

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const sendStateToIframe = useCallback((state: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "populate-state", payload: state },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "state-update" && e.data.payload) {
        localStorage.setItem("agentConfig", JSON.stringify(e.data.payload));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `Error ${res.status}`);
      }
      const { state } = await res.json();
      localStorage.setItem("agentConfig", JSON.stringify(state));
      const iframe = iframeRef.current;
      if (iframe?.contentDocument?.readyState === "complete") {
        sendStateToIframe(state);
      } else {
        iframe?.addEventListener("load", () => sendStateToIframe(state), { once: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndTest = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "get-state" },
      window.location.origin
    );
    setTimeout(() => router.push("/test"), 300);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-neutral-25)" }}>

      {/* ── Hero — primary-200 (#CBE5C7) light green ── */}
      <div
        style={{ background: "var(--color-primary-50)" }}
        className="px-8 pt-6 pb-12"
      >
        {/* Nav */}
        <nav className="flex items-center justify-center gap-5 mb-12">
          <span className="font-semibold" style={{ fontSize: 15, color: "var(--color-primary-900)" }}>
            Create
          </span>
          <span style={{ color: "var(--color-primary-500)" }}>|</span>
          <Link
            href="/test"
            className="transition-colors"
            style={{ fontSize: 15, color: "var(--color-primary-700)" }}
          >
            Test
          </Link>
        </nav>

        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h1
            className="font-bold mb-2"
            style={{ fontSize: 30, lineHeight: 1.25, color: "var(--color-primary-900)" }}
          >
            Create an 11Sight AI Agent to Augment Your Workforce
          </h1>

          {/* Subheadline */}
          <p
            className="mb-8 italic"
            style={{ fontSize: 16, color: "var(--color-primary-700)" }}
          >
            Grounded in Rigorous Software Engineering
          </p>

          {/* Benefit boxes */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {BENEFITS.map((b) => (
              <div
                key={b.line1}
                className="rounded-xl p-5 flex flex-col items-center justify-center text-center"
                style={{
                  background: "var(--color-primary-100)",
                  border: "1px solid var(--color-primary-300)",
                  minHeight: 80,
                }}
              >
                <p
                  className="font-semibold"
                  style={{ fontSize: 14, lineHeight: 1.4, color: "var(--color-primary-900)" }}
                >
                  {b.line1}<br />{b.line2}
                </p>
              </div>
            ))}
          </div>

          {/* Prompt */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
              }}
              rows={3}
              placeholder="Create the agent with a single prompt..."
              className="w-full rounded-xl px-5 py-4 pr-32 resize-none focus:outline-none shadow-sm placeholder:text-neutral-400"
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                background: "#fff",
                color: "var(--color-neutral-950)",
                border: "1.5px solid var(--color-primary-300)",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3.5 right-3.5 rounded-full px-5 py-1.5 font-semibold transition-all cursor-pointer disabled:opacity-40"
              style={{
                fontSize: 13,
                background: "#4ca749",
                color: "#fff",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating
                </span>
              ) : "Submit"}
            </button>
          </div>
          {error && (
            <p className="mt-2" style={{ fontSize: 13, color: "var(--color-primary-800)" }}>{error}</p>
          )}
        </div>
      </div>

      {/* ── Questionnaire section — neutral-50 ── */}
      <div className="flex-1 px-6 py-8" style={{ background: "var(--color-neutral-25)" }}>
        <div className="max-w-6xl mx-auto">
          <p
            className="text-center font-medium mb-5"
            style={{ fontSize: 15, color: "var(--color-neutral-600)" }}
          >
            Customize the Agent by Ticking Features On/Off and Specify Task Workflows
          </p>

          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{
              border: "1.5px solid var(--color-neutral-200)",
              background: "#fff",
              minHeight: 700,
            }}
          >
            <iframe
              ref={iframeRef}
              src="/questionnaire.html"
              className="w-full border-0 block"
              style={{ minHeight: 700 }}
              title="SME Questionnaire"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveAndTest}
              className="rounded-full px-8 py-2.5 font-semibold transition-colors cursor-pointer shadow-sm"
              style={{
                fontSize: 14,
                background: "#4ca749",
                color: "#fff",
              }}
            >
              Save and Test Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
