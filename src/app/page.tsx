"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Nav from "@/components/Nav";

export default function AgentBuilder() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleGenerate = async () => {
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
        throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
      }

      const { state } = await res.json();
      localStorage.setItem("agentConfig", JSON.stringify(state));
      setHasGenerated(true);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleGenerate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-25">
      <Nav />

      <div className="bg-white border-b border-neutral-100 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p
            className="font-semibold uppercase text-primary-600 mb-2"
            style={{ fontSize: 11, letterSpacing: "0.14em" }}
          >
            Agent Builder
          </p>
          <h1 className="font-bold text-neutral-950 mb-1" style={{ fontSize: 30 }}>
            Create your AI agent
          </h1>
          <p className="text-neutral-500 mb-6" style={{ fontSize: 15 }}>
            Describe your agent in plain language and we&apos;ll configure it automatically.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="e.g. A friendly service agent for a Toyota dealership in Bergen. It answers in Norwegian and English, books service appointments, offers a loaner car, and transfers to a human when the caller asks."
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 placeholder:text-neutral-400"
            style={{ fontSize: 14, lineHeight: "1.6" }}
          />

          {error && (
            <p className="mt-2 text-red-600" style={{ fontSize: 13 }}>
              {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <p className="text-neutral-400" style={{ fontSize: 12 }}>
              Tip: Press Ctrl+Enter to generate
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontSize: 14 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                "Generate Agent →"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {!hasGenerated && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-2">
            <div
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"
              style={{ fontSize: 18 }}
            >
              ↑
            </div>
            <p className="text-neutral-500 font-medium" style={{ fontSize: 13 }}>
              Generate an agent above to pre-fill the form
            </p>
            <p className="text-neutral-400" style={{ fontSize: 12 }}>
              or fill it in manually below
            </p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/questionnaire.html"
          className="w-full border-0 block"
          style={{ minHeight: 860 }}
          title="Agent configuration questionnaire"
        />
      </div>
    </div>
  );
}
