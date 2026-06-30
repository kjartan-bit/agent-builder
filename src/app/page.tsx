"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HERO_GREEN = "#3A5E31";

const PILLS = [
  "Handles all calls at scale",
  "Resolves the most complex tasks",
  "Maintaining CSAT w/ AI Personas",
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
    <div className="min-h-screen flex flex-col bg-neutral-100">

      {/* ── Hero ── */}
      <div
        style={{ backgroundColor: HERO_GREEN }}
        className="relative overflow-hidden px-8 pt-6 pb-14"
      >
        {/* Nav */}
        <nav className="flex items-center gap-5 mb-10">
          <span className="text-white font-semibold" style={{ fontSize: 15 }}>
            Create
          </span>
          <span className="text-white/40">|</span>
          <Link
            href="/test"
            className="text-white/60 hover:text-white transition-colors"
            style={{ fontSize: 15 }}
          >
            Test
          </Link>
        </nav>

        {/* Background label placeholder */}
        <p
          className="absolute top-6 right-8 text-white/25 italic select-none"
          style={{ fontSize: 12 }}
        >
          &lt;background graphics of Serena&gt;
        </p>

        {/* Copy + prompt */}
        <div className="max-w-xl mx-auto text-center">
          <h1
            className="text-white font-bold mb-2"
            style={{ fontSize: 26, lineHeight: 1.35 }}
          >
            Generate an 11Sight AI Agent to augment your workforce
          </h1>
          <p className="text-white/70 italic mb-7" style={{ fontSize: 16 }}>
            -grounded in rigorous software engineering-
          </p>

          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            {PILLS.map((p) => (
              <span
                key={p}
                className="text-white border border-white/40 rounded-full px-4 py-1.5 bg-white/10"
                style={{ fontSize: 13 }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Prompt box */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
              }}
              rows={3}
              placeholder="Create the agent with a single prompt..."
              className="w-full rounded-xl bg-white text-neutral-900 px-5 py-4 pr-28 resize-none focus:outline-none shadow-md placeholder:text-neutral-400"
              style={{ fontSize: 14, lineHeight: 1.6 }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3.5 right-3.5 border border-neutral-300 rounded-full px-5 py-1.5 text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-40 transition-colors cursor-pointer font-medium"
              style={{ fontSize: 13 }}
            >
              {loading ? "…" : "Submit"}
            </button>
          </div>

          {error && (
            <p className="text-red-300 mt-2 text-sm">{error}</p>
          )}
        </div>
      </div>

      {/* ── Questionnaire section ── */}
      <div className="flex-1 px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center text-neutral-700 font-medium mb-6"
            style={{ fontSize: 15 }}
          >
            Customize the agent by ticking features on/off and specify task
            workflows
          </p>

          <div
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm"
            style={{ minHeight: 620 }}
          >
            <iframe
              ref={iframeRef}
              src="/questionnaire.html"
              className="w-full border-0 block"
              style={{ minHeight: 620 }}
              title="SME Questionnaire"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveAndTest}
              className="border border-neutral-400 rounded-full px-8 py-2.5 font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm"
              style={{ fontSize: 14 }}
            >
              Save and Test Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
